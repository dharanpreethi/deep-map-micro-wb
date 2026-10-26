/* =====================================================================
   Deep Mapping of Micro Water Bodies — soundscapes
   Everything here is synthesised live with the Web Audio API: no audio
   files, no samples. Six scenes:
     theme   – tanpura drone, bansuri in Raag Bhupali, soft rain on water
     lake    – lapping waves, oar splashes, santoor in Raag Durga, birds
     pond    – frogs, crickets, monsoon drops, low bansuri in Raag Megh
     tank    – temple bells, echoing stepwell drips, shankh, deep drone
     canal   – flowing water, ektara with gopiyantra bends, soft dhol
     channel – babbling river, koel calls, wind, bansuri in Raag Malkauns
   Browsers only allow sound after the visitor's first tap or key press,
   so the soundscape starts on that first interaction.
   ===================================================================== */
(function () {
  'use strict';
  const SCENES = {
    theme: { name: 'Jal-smriti theme', desc: 'Tanpura, bansuri in Raag Bhupali, rain on water' },
    lake: { name: 'Lake soundscape', desc: 'Lapping waves, oars, santoor, distant birds' },
    pond: { name: 'Pond soundscape', desc: 'Frogs, crickets, monsoon drops, low bansuri' },
    tank: { name: 'Kund soundscape', desc: 'Temple bells, stepwell drips, shankh' },
    canal: { name: 'Canal soundscape', desc: 'Flowing water, ektara, soft dhol' },
    channel: { name: 'River soundscape', desc: 'Babbling water, koel calls, bansuri' }
  };
  const TYPE_SCENE = { lake: 'lake', pond: 'pond', tank: 'tank', canal: 'canal', dam: 'canal', channel: 'channel' };
  const VOLUME = 1.5;
  const SA = 146.83; // tonic: D3

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  let on = store.get('dm-sound', '1') === '1';
  let ctx = null, master = null, reverb = null, noiseBuf = null;
  let current = null, currentKey = null, wantKey = 'theme', running = false;
  const listeners = [];
  const emit = () => listeners.forEach(f => { try { f(api.state()); } catch (e) { /* ignore */ } });

  /* ---------------- engine ---------------- */
  function init() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3;
    master = ctx.createGain(); master.gain.value = 0;
    master.connect(comp); comp.connect(ctx.destination);
    reverb = ctx.createConvolver(); reverb.buffer = impulse(3.4, 2.6);
    reverb.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }
  function impulse(sec, decay) {
    const sr = ctx.sampleRate, n = Math.floor(sr * sec), b = ctx.createBuffer(2, n, sr);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay); }
    return b;
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const st = (base, semis) => base * Math.pow(2, semis / 12);

  // a scene owns an output bus, a reverb send, its sources and its timers
  function makeScene(key) {
    const S = { key, alive: true, timers: [], nodes: [] };
    S.out = ctx.createGain(); S.out.gain.value = 0; S.out.connect(master);
    S.wet = ctx.createGain(); S.wet.gain.value = 1; S.wet.connect(reverb);
    BUILD[key](S);
    S.out.gain.setTargetAtTime(1, ctx.currentTime, 1.0);
    return S;
  }
  function killScene(S) {
    if (!S) return;
    S.alive = false;
    S.timers.forEach(clearTimeout);
    const t = ctx.currentTime;
    S.out.gain.cancelScheduledValues(t);
    S.out.gain.setTargetAtTime(0, t, 0.7);
    S.wet.gain.setTargetAtTime(0, t, 0.9);
    setTimeout(() => {
      S.nodes.forEach(n => { try { n.stop(); } catch (e) { /* already stopped */ } });
      try { S.out.disconnect(); S.wet.disconnect(); } catch (e) { /* ignore */ }
    }, 4500);
  }
  // repeating random-interval scheduler bound to the scene's life
  function every(S, minS, maxS, fn, first) {
    const tick = () => { if (!S.alive) return; try { fn(ctx.currentTime + 0.05); } catch (e) { /* keep going */ } S.timers.push(setTimeout(tick, rnd(minS, maxS) * 1000)); };
    S.timers.push(setTimeout(tick, (first != null ? first : rnd(0, minS)) * 1000));
  }
  // route a node to the scene: dry level, reverb level, stereo position
  function route(S, node, dry, wet, pan) {
    let n = node;
    if (pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; n.connect(p); n = p; }
    if (dry) { const g = ctx.createGain(); g.gain.value = dry; n.connect(g); g.connect(S.out); }
    if (wet) { const g = ctx.createGain(); g.gain.value = wet; n.connect(g); g.connect(S.wet); }
  }
  function noise(S) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    s.loopStart = 0; s.start(ctx.currentTime, Math.random() * 1.9); S.nodes.push(s); return s;
  }
  function lfo(S, rate, depth, target, offset) {
    const o = ctx.createOscillator(); o.frequency.value = rate;
    const g = ctx.createGain(); g.gain.value = depth;
    o.connect(g); g.connect(target); if (offset != null) target.value = offset;
    o.start(); S.nodes.push(o); return o;
  }
  function filter(type, freq, q) { const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; if (q != null) f.Q.value = q; return f; }
  function env(g, t, a, peak, hold, rel) {
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setValueAtTime(peak, t + a + hold); g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + rel);
  }

  /* ---------------- water & air textures ---------------- */
  function lapping(S, level) {
    const n = noise(S), lp = filter('lowpass', 520, 0.5), g = ctx.createGain(); g.gain.value = level * 0.5;
    n.connect(lp); lp.connect(g); lfo(S, 0.11, level * 0.45, g.gain); lfo(S, 0.07, 160, lp.frequency, 520);
    route(S, g, 1, 0.2);
    const n2 = noise(S), bp = filter('bandpass', 1600, 0.8), g2 = ctx.createGain(); g2.gain.value = level * 0.08;
    n2.connect(bp); bp.connect(g2); lfo(S, 0.17, level * 0.07, g2.gain); route(S, g2, 1, 0.3, 0.3);
  }
  function flowing(S, level, bright) {
    const n = noise(S), bp = filter('bandpass', 750, 0.6), g = ctx.createGain(); g.gain.value = level * 0.55;
    n.connect(bp); bp.connect(g); lfo(S, 0.05, 140, bp.frequency, 750); route(S, g, 1, 0.15, -0.2);
    const n2 = noise(S), hp = filter('highpass', 2600), g2 = ctx.createGain(); g2.gain.value = level * (bright || 0.05);
    n2.connect(hp); hp.connect(g2); lfo(S, 0.3, level * 0.03, g2.gain); route(S, g2, 1, 0.1, 0.25);
  }
  function bubble(S, t, base, level) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = base * rnd(0.8, 1.4);
    o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.7, t + 0.05);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    o.connect(g); o.start(t); o.stop(t + 0.1); route(S, g, 1, 0.25, rnd(-0.6, 0.6));
  }
  function drop(S, t, f, level, wet) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(f * 1.9, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.06);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(g); o.start(t); o.stop(t + 0.32); route(S, g, 0.7, wet, rnd(-0.7, 0.7));
  }
  function rain(S, level) {
    const n = noise(S), hp = filter('highpass', 3200), g = ctx.createGain(); g.gain.value = level * 0.05;
    n.connect(hp); hp.connect(g); route(S, g, 1, 0.2);
    every(S, 0.12, 0.6, t => drop(S, t, rnd(1300, 3200), level * 0.05, 0.4));
  }
  function wind(S, level) {
    const n = noise(S), lp = filter('lowpass', 380, 1.2), g = ctx.createGain(); g.gain.value = level * 0.18;
    n.connect(lp); lp.connect(g); lfo(S, 0.06, 220, lp.frequency, 420); lfo(S, 0.045, level * 0.1, g.gain);
    route(S, g, 1, 0.3, -0.3);
  }
  function splash(S, t, level) {
    const n = ctx.createBufferSource(); n.buffer = noiseBuf;
    const lp = filter('lowpass', 1400, 0.7), g = ctx.createGain();
    lp.frequency.setValueAtTime(2200, t); lp.frequency.exponentialRampToValueAtTime(500, t + 0.5);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    n.connect(lp); lp.connect(g); n.start(t, Math.random()); n.stop(t + 0.8); route(S, g, 1, 0.35, rnd(-0.4, 0.4));
  }

  /* ---------------- creatures ---------------- */
  function frog(S, t, pitch, level, pan) {
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = pitch;
    const bp = filter('bandpass', pitch * 4.5, 4), g = ctx.createGain(); g.gain.value = 0;
    const pulses = Math.floor(rnd(5, 11)), rate = rnd(0.032, 0.05);
    for (let k = 0; k < pulses; k++) { const s = t + k * rate; g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(level, s + 0.008); g.gain.linearRampToValueAtTime(0, s + rate * 0.8); }
    o.connect(bp); bp.connect(g); o.start(t); o.stop(t + pulses * rate + 0.05); route(S, g, 1, 0.3, pan);
  }
  function cricket(S, t, level, pan) {
    const o = ctx.createOscillator(); o.frequency.value = rnd(4300, 5200);
    const g = ctx.createGain(); g.gain.value = 0;
    for (let c = 0; c < 3; c++) for (let k = 0; k < 4; k++) { const s = t + c * 0.32 + k * 0.03; g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(level, s + 0.006); g.gain.linearRampToValueAtTime(0, s + 0.02); }
    o.connect(g); o.start(t); o.stop(t + 1.1); route(S, g, 1, 0.15, pan);
  }
  function koel(S, t, level) { // ku-ooo, ku-ooo, rising each time
    const calls = Math.floor(rnd(3, 6)), pan = rnd(-0.7, 0.7);
    let f = rnd(640, 760);
    for (let k = 0; k < calls; k++) {
      const s = t + k * 0.85, o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(f, s); o.frequency.linearRampToValueAtTime(f * 1.32, s + 0.22); o.frequency.setValueAtTime(f * 1.32, s + 0.45);
      g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(level * 0.6, s + 0.04); g.gain.linearRampToValueAtTime(level, s + 0.25); g.gain.exponentialRampToValueAtTime(0.0001, s + 0.55);
      o.connect(g); o.start(s); o.stop(s + 0.6); route(S, g, 0.8, 0.5, pan);
      f *= 1.07;
    }
  }
  function chirps(S, t, level) {
    const n = Math.floor(rnd(2, 5)), pan = rnd(-0.8, 0.8), base = rnd(2600, 3600);
    for (let k = 0; k < n; k++) {
      const s = t + k * rnd(0.09, 0.16), o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(base, s); o.frequency.exponentialRampToValueAtTime(base * rnd(1.3, 1.6), s + 0.06);
      g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(level, s + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, s + 0.08);
      o.connect(g); o.start(s); o.stop(s + 0.1); route(S, g, 0.7, 0.6, pan);
    }
  }

  /* ---------------- instruments ---------------- */
  const ksCache = {};
  function ks(freq, sec, damp, bright) { // Karplus-Strong plucked string, rendered once and cached
    const key = Math.round(freq * 10) + '|' + sec + '|' + damp + '|' + bright;
    if (ksCache[key]) return ksCache[key];
    const sr = ctx.sampleRate, N = Math.max(2, Math.round(sr / freq)), len = Math.floor(sr * sec);
    const b = ctx.createBuffer(1, len, sr), y = b.getChannelData(0);
    let prev = 0;
    for (let i = 0; i < N; i++) { const r = Math.random() * 2 - 1; prev = prev + bright * (r - prev); y[i] = prev; }
    for (let i = N; i < len; i++) y[i] = damp * 0.5 * (y[i - N] + y[i - N - 1 < 0 ? 0 : i - N - 1]);
    let peak = 0; for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(y[i]));
    if (peak > 0) for (let i = 0; i < len; i++) y[i] /= peak;
    return (ksCache[key] = b);
  }
  function pluck(S, t, freq, level, o = {}) {
    const s = ctx.createBufferSource(); s.buffer = ks(freq, o.sec || 3, o.damp || 0.996, o.bright || 0.5);
    const g = ctx.createGain(); g.gain.value = level;
    if (o.bend) { s.playbackRate.setValueAtTime(1, t + 0.08); s.playbackRate.linearRampToValueAtTime(o.bend, t + 0.35); }
    s.connect(g); s.start(t); s.stop(t + (o.sec || 3)); route(S, g, 1, o.wet != null ? o.wet : 0.35, o.pan || 0);
  }
  function flute(S, t, freq, dur, level, pan) {
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(); o2.type = 'triangle';
    o1.frequency.value = freq; o2.frequency.value = freq * 2;
    const v = ctx.createOscillator(), vg = ctx.createGain(); v.frequency.value = 5.2; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(freq * 0.007, t + Math.min(0.5, dur * 0.6));
    v.connect(vg); vg.connect(o1.frequency); vg.connect(o2.frequency);
    const g = ctx.createGain(), g2 = ctx.createGain(); g2.gain.value = 0.12;
    const a = Math.min(0.14, dur * 0.3), rel = 0.35;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + a); g.gain.setValueAtTime(level * 0.85, t + dur); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel);
    o1.connect(g); o2.connect(g2); g2.connect(g);
    const n = ctx.createBufferSource(); n.buffer = noiseBuf; const bp = filter('bandpass', freq * 2, 2.5), ng = ctx.createGain();
    ng.gain.setValueAtTime(0, t); ng.gain.linearRampToValueAtTime(level * 0.35, t + 0.05); ng.gain.exponentialRampToValueAtTime(level * 0.06, t + 0.25); ng.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel);
    n.connect(bp); bp.connect(ng); ng.connect(g);
    [o1, o2, v].forEach(x => { x.start(t); x.stop(t + dur + rel + 0.05); }); n.start(t, Math.random()); n.stop(t + dur + rel + 0.05);
    route(S, g, 0.7, 0.75, pan || 0);
  }
  function bell(S, t, freq, level, pan) {
    [[1, 1, 7], [1.004, 0.7, 6.5], [2.0, 0.55, 4.5], [2.76, 0.42, 3.2], [5.4, 0.22, 2.2], [8.93, 0.1, 1.4]].forEach(([r, a, d]) => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = freq * r;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level * a, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); o.start(t); o.stop(t + d + 0.05); route(S, g, 0.6, 0.8, pan || 0);
    });
  }
  function shankh(S, t, level) { // conch: a slow swell with a breathy edge
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(220, t); o.frequency.linearRampToValueAtTime(233, t + 1.2);
    const v = ctx.createOscillator(), vg = ctx.createGain(); v.frequency.value = 4.5; vg.gain.value = 2.5; v.connect(vg); vg.connect(o.frequency);
    const lp = filter('lowpass', 900, 5), g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + 1.3); g.gain.setValueAtTime(level, t + 3); g.gain.exponentialRampToValueAtTime(0.0001, t + 4.8);
    o.connect(lp); lp.connect(g); [o, v].forEach(x => { x.start(t); x.stop(t + 5); }); route(S, g, 0.5, 0.9, -0.2);
  }
  function thump(S, t, level, hi) { // soft dhol stroke
    const o = ctx.createOscillator(), g = ctx.createGain(), f = hi ? 210 : 88;
    o.frequency.setValueAtTime(f * 1.6, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.06);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + (hi ? 0.18 : 0.45));
    o.connect(g); o.start(t); o.stop(t + 0.5); route(S, g, 1, 0.2);
  }
  function tanpura(S, level, notes) { // Pa · Sa · Sa · low Sa, endlessly
    const seq = notes || [7 - 12, 0, 0, -12];
    let i = 0;
    every(S, 1.15, 1.25, t => { pluck(S, t, st(SA, seq[i % seq.length]), level, { sec: 5, damp: 0.9985, bright: 0.35, wet: 0.5, pan: (i % 2 ? 0.25 : -0.25) }); i++; }, 0.1);
  }
  // a raga phrase: a gentle random walk over the scale that comes home to Sa or Pa
  function melody(S, scale, base, voice, opts = {}) {
    const deg = [];
    for (let o = 0; o < 3; o++) scale.forEach(s => deg.push(s + 12 * o));
    let pos = deg.indexOf(scale[0] + 12);
    const phrase = () => {
      if (!S.alive) return;
      let t = ctx.currentTime + 0.1;
      const n = Math.floor(rnd(opts.min || 4, opts.max || 8));
      for (let k = 0; k < n; k++) {
        pos = Math.max(0, Math.min(deg.length - 1, pos + pick([-1, -1, 1, 1, 2, -2, 0])));
        const last = k === n - 1;
        if (last) { const home = [0, 7, 12, 19].map(x => deg.indexOf(x)).filter(x => x >= 0); pos = home.reduce((a, b) => Math.abs(b - pos) < Math.abs(a - pos) ? b : a); }
        const dur = last ? rnd(1.6, 2.6) : pick(opts.durs || [0.35, 0.5, 0.7, 1.0]);
        voice(t, st(base, deg[pos]), dur, last);
        t += dur * (opts.legato || 0.95);
      }
      S.timers.push(setTimeout(phrase, ((t - ctx.currentTime) + rnd(opts.rest ? opts.rest[0] : 3, opts.rest ? opts.rest[1] : 7)) * 1000));
    };
    S.timers.push(setTimeout(phrase, (opts.delay || 2) * 1000));
  }

  /* ---------------- the six scenes ---------------- */
  const BHUPALI = [0, 2, 4, 7, 9], DURGA = [0, 2, 5, 7, 9], MEGH = [0, 2, 5, 7, 10], MALKAUNS = [0, 3, 5, 8, 10];
  const BUILD = {
    theme(S) {
      tanpura(S, 0.16);
      rain(S, 0.55);
      lapping(S, 0.18);
      melody(S, BHUPALI, SA * 2, (t, f, d) => flute(S, t, f, d, 0.06, 0.1), { rest: [4, 8], delay: 3 });
    },
    lake(S) {
      lapping(S, 0.55);
      wind(S, 0.35);
      every(S, 5, 9, t => { splash(S, t, 0.09); splash(S, t + 1.1, 0.07); }, 2);
      every(S, 6, 13, t => chirps(S, t, 0.03), 3);
      tanpura(S, 0.07, [7 - 12, 0, 0, -12]);
      melody(S, DURGA, SA * 2, (t, f, d) => { // santoor: a quick tremolo roll on each note
        const rolls = d > 0.6 ? 4 : 2;
        for (let r = 0; r < rolls; r++) pluck(S, t + r * 0.085, f * 2, 0.07 * (1 - r * 0.15), { sec: 2.2, damp: 0.994, bright: 0.8, wet: 0.4, pan: 0.2 });
      }, { rest: [3, 6], durs: [0.3, 0.45, 0.6, 0.9], delay: 2.5 });
    },
    pond(S) {
      rain(S, 0.9);
      lapping(S, 0.12);
      every(S, 0.8, 2.6, t => frog(S, t, pick([150, 175, 210, 260]), 0.11, rnd(-0.8, 0.8)), 0.5);
      every(S, 0.6, 1.4, t => cricket(S, t, 0.012, rnd(-0.9, 0.9)), 0.3);
      every(S, 0.25, 0.9, t => drop(S, t, rnd(700, 1400), 0.05, 0.35));
      tanpura(S, 0.08, [5 - 12, 0, 0, -12]);
      melody(S, MEGH, SA, (t, f, d) => flute(S, t, f * 2, d, 0.055, -0.15), { rest: [6, 11], delay: 5, durs: [0.5, 0.8, 1.2] });
    },
    tank(S) {
      S.wet.gain.value = 1.4; // stone echoes of a stepwell
      tanpura(S, 0.14, [-12, -5, -12, 0]);
      every(S, 0.9, 2.8, t => drop(S, t, rnd(900, 1700), 0.06, 1.1));
      every(S, 6, 11, t => { const f = pick([st(SA * 4, 0), st(SA * 4, 7), st(SA * 4, 12)]); bell(S, t, f, 0.09, rnd(-0.5, 0.5)); if (Math.random() < 0.4) bell(S, t + 0.45, f * 1.5, 0.05, 0.3); }, 1.5);
      every(S, 22, 34, t => shankh(S, t, 0.05), 9);
      lapping(S, 0.08);
    },
    canal(S) {
      flowing(S, 0.5, 0.06);
      every(S, 0.12, 0.5, t => bubble(S, t, 520, 0.025));
      const beat = 0.9; let k = 0; // dha · · dha ta ·
      every(S, beat, beat, t => { const p = k % 6; if (p === 0 || p === 3) thump(S, t, 0.12); if (p === 4) thump(S, t, 0.05, true); k++; }, 1);
      let e = 0; // ektara: Sa Sa Pa Sa, with a gopiyantra bend now and then
      every(S, beat / 2, beat / 2, t => { if (e % 8 !== 7) pluck(S, t, st(SA * 2, [0, 0, 7, 0, 0, 12, 7, 0][e % 8]), 0.08, { sec: 2, damp: 0.993, bright: 0.7, wet: 0.25, pan: 0.25, bend: Math.random() < 0.18 ? 1.06 : 0 }); e++; }, 1.2);
      every(S, 14, 26, t => koel(S, t, 0.025), 8);
    },
    channel(S) {
      flowing(S, 0.6, 0.09);
      every(S, 0.05, 0.22, t => bubble(S, t, 700, 0.03));
      wind(S, 0.4);
      every(S, 9, 17, t => koel(S, t, 0.04), 2);
      every(S, 5, 10, t => chirps(S, t, 0.025), 4);
      tanpura(S, 0.07, [8 - 12, 0, 0, -12]);
      melody(S, MALKAUNS, SA, (t, f, d) => flute(S, t, f * 2, d, 0.055, 0.15), { rest: [5, 9], delay: 4 });
    }
  };

  /* ---------------- control ---------------- */
  function apply() {
    if (!ctx || ctx.state !== 'running' || !on) return;
    if (currentKey === wantKey && current) return;
    killScene(current);
    current = makeScene(wantKey); currentKey = wantKey;
    emit();
  }
  function unlock() {
    if (!on) return;
    if (!init()) return;
    const go = () => {
      running = ctx.state === 'running';
      if (!running) return;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(VOLUME, ctx.currentTime, 0.8);
      apply(); emit();
    };
    if (ctx.state !== 'running') ctx.resume().then(go, () => { }); else go();
  }
  ['pointerdown', 'keydown', 'touchend'].forEach(ev => document.addEventListener(ev, unlock, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (on) ctx.resume().then(() => { running = true; apply(); emit(); }, () => { });
  });

  const api = {
    SCENES, TYPE_SCENE,
    scene(key) { wantKey = SCENES[key] ? key : (TYPE_SCENE[key] || 'theme'); apply(); emit(); },
    sceneForType(type) { return TYPE_SCENE[type] || 'theme'; },
    toggle(force) {
      on = force != null ? !!force : !on;
      store.set('dm-sound', on ? '1' : '0');
      if (on) { unlock(); }
      else if (ctx) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
        const S = current; current = null; currentKey = null;
        setTimeout(() => { killScene(S); if (!on && ctx) ctx.suspend(); }, 900);
      }
      emit();
      return on;
    },
    state() { return { on, playing: !!(on && ctx && ctx.state === 'running' && current), scene: wantKey, name: SCENES[wantKey].name, desc: SCENES[wantKey].desc }; },
    onchange(fn) { listeners.push(fn); fn(api.state()); },
    // a small floating sound switch for pages without the map's control rail
    mountFloating() {
      const b = document.createElement('button');
      b.className = 'snd-float'; b.type = 'button';
      const ico = on2 => on2
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5 H7.5 L12 5.5 V18.5 L7.5 14.5 H4 Z" fill="currentColor" fill-opacity=".18"/><path d="M15.5 9 q2 3 0 6 M18 6.5 q4 5.5 0 11"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5 H7.5 L12 5.5 V18.5 L7.5 14.5 H4 Z" fill="currentColor" fill-opacity=".18"/><path d="M16 9.5 L21 14.5 M21 9.5 L16 14.5"/></svg>';
      b.addEventListener('click', e => { e.stopPropagation(); api.toggle(); });
      document.body.appendChild(b);
      api.onchange(st2 => {
        b.innerHTML = ico(st2.on) + '<span class="eq"><i></i><i></i><i></i></span><span class="lbl">' + (st2.on ? (st2.playing ? st2.name : 'Tap anywhere for sound') : 'Sound off') + '</span>';
        b.classList.toggle('playing', st2.playing); b.classList.toggle('await', st2.on && !st2.playing);
        b.setAttribute('aria-pressed', String(st2.on)); b.setAttribute('aria-label', st2.on ? 'Turn sound off' : 'Turn sound on');
        b.title = st2.on ? st2.desc : 'Sound is off';
      });
      return b;
    }
  };
  window.DM_SOUND = api;
})();
