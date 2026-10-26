/* Home page: mandala of the four layers, floating diyas, live numbers, case studies. */
(function () {
  'use strict';
  const I = window.DM_ICONS, R = window.DM_RECORDS || [], $ = s => document.querySelector(s);
  const K = ['historical', 'cultural', 'literary', 'environmental'];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // mandala: kolam rings, stepped kund at the centre, the four layers in orbit, the fish narrator swimming
  let dots = '', petals = '', ticks = '';
  for (let i = 0; i < 48; i++) { const a = i * 7.5 * Math.PI / 180; dots += `<circle cx="${(200 + Math.cos(a) * 186).toFixed(1)}" cy="${(200 + Math.sin(a) * 186).toFixed(1)}" r="${i % 4 ? 1.6 : 3}"/>`; }
  for (let i = 0; i < 16; i++) petals += `<path d="M200 46 C212 64 212 80 200 96 C188 80 188 64 200 46 Z" transform="rotate(${i * 22.5} 200 200)"/>`;
  for (let i = 0; i < 72; i++) ticks += `<path d="M200 ${i % 6 ? 26 : 20} V32" transform="rotate(${i * 5} 200 200)"/>`;
  const sq = s => `M200 ${200 - s} L${200 + s} 200 L200 ${200 + s} L${200 - s} 200 Z`;
  const m = $('#mandala');
  if (m) {
    m.innerHTML = `<svg viewBox="0 0 400 400" aria-hidden="true">
      <defs><radialGradient id="mw" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#9cc7cf"/><stop offset=".7" stop-color="#4f86a0"/><stop offset="1" stop-color="#1f3364"/></radialGradient></defs>
      <g class="r1" fill="var(--gold)">${dots}</g>
      <g class="r1" stroke="var(--ink-3)" stroke-width="1">${ticks}</g>
      <g class="r2" fill="none" stroke="var(--gold)" stroke-width="1"><circle cx="200" cy="200" r="168" stroke-dasharray="3 7"/><circle cx="200" cy="200" r="156"/></g>
      <g class="r2" fill="color-mix(in srgb, var(--gold) 22%, transparent)" stroke="var(--gold)" stroke-width=".8">${petals}</g>
      <path d="${sq(104)}" fill="color-mix(in srgb, var(--paper) 85%, transparent)" stroke="var(--terracotta)" stroke-width="1.6"/>
      <path d="${sq(88)}" fill="none" stroke="var(--terracotta)" stroke-width="1.2"/>
      <path d="${sq(72)}" fill="url(#mw)" stroke="var(--gold)" stroke-width="1.4"/>
      <g stroke="var(--terracotta)" stroke-width="1"><path d="M200 96 V112 M304 200 H288 M200 304 V288 M96 200 H112"/></g>
      <g fill="none" stroke="#dcecf1" stroke-width="1.2" opacity=".7"><circle cx="200" cy="200" r="20"><animate attributeName="r" values="10;64" dur="4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="4s" repeatCount="indefinite"/></circle><circle cx="200" cy="200" r="20"><animate attributeName="r" values="10;64" dur="4s" begin="2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="4s" begin="2s" repeatCount="indefinite"/></circle></g>
    </svg>
    <div class="core">${I.fish('guide')}</div>
    <div class="orbit">${K.map((k, i) => `<a href="about.html#layers" style="--a:${i * 90 + 45}deg" aria-label="${I.LAYERS[k].name} layer"><span>${I.layerMedallion(k)}<span class="orbit-label">${I.LAYERS[k].name}</span></span></a>`).join('')}</div>`;
  }

  // diyas floating on the river
  const wl = $('#waterline');
  if (wl) [0, 17, 35].forEach((d, i) => {
    const el = document.createElement('div'); el.className = 'diya'; el.style.animationDelay = (i * .8) + 's, -' + d + 's';
    el.innerHTML = '<svg viewBox="0 0 46 40"><ellipse cx="23" cy="36" rx="16" ry="3" fill="#0b1530" opacity=".25"/><circle cx="23" cy="13" r="10" fill="#f3b33a" opacity=".25"/><path class="fl" d="M23 22 C19.6 19 21 15.6 23 10.6 C25 15.6 26.4 19 23 22 Z" fill="#f6b73c" stroke="#b4471c" stroke-width="1"/><path d="M8 24 Q23 39 38 24 Z" fill="#b8643a" stroke="#5a2e17" stroke-width="1.2"/><path d="M7 24 H39" stroke="#5a2e17" stroke-width="1.4"/></svg>';
    wl.appendChild(el);
  });

  // marquee of names
  const mq = $('#marquee');
  if (mq && R.length) {
    const seen = new Set(), items = R.filter(r => { const k = r.name.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
    const html = items.map(r => `<span>${I.typeIcon(r.type)}${esc(r.name)}</span>`).join('');
    mq.innerHTML = html + html;
  }

  // layer cards with fish personas
  const lc = $('#layerCards');
  const LTEXT = {
    historical: 'Where the water body came from and what it meant: rulers, builders, battles and the records that remember them.',
    cultural: 'How the water is lived with today: ritual bathing, festivals, temples, ghats and community gatherings.',
    literary: 'How the water is imagined: poetry, fiction, travel writing, inscriptions and local storytelling.',
    environmental: 'What the water is suffering now: sewage, effluents, siltation, encroachment — and the urgency to act.'
  };
  if (lc) lc.innerHTML = K.map(k => { const L = I.LAYERS[k]; const n = R.filter(r => r.status[k] === 'complete').length; return `<div class="card layer-card rv" style="--c:${L.color}">${I.fish(k)}${I.layerMedallion(k)}<h3>${L.name} <span class="deva">${L.native}</span></h3><p>${LTEXT[k]}</p><p class="note" style="margin-top:.7rem"><b style="color:${L.color}">${n}</b> water bodies with this layer written</p></div>`; }).join('');

  // live numbers
  const st = $('#stats');
  if (st && R.length) {
    const states = new Set(R.map(r => r.state)).size, forms = new Set(R.map(r => r.type)).size, written = R.reduce((a, r) => a + r.done, 0);
    st.innerHTML = [[R.length, 'water bodies mapped'], [states, 'Indian states'], [forms, 'water forms'], [written, 'layers written']].map(([n, l]) => `<div><b data-n="${n}">${n}</b><span>${l}</span></div>`).join('');
    const run = () => st.querySelectorAll('b').forEach(b => { const n = +b.dataset.n, t0 = performance.now(); (function tk(t) { const k = Math.min(1, (t - t0) / 1600); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tk); })(t0); });
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { run(); io.disconnect(); } }); io.observe(st); } else run();
  }

  // case studies from the paper
  const CASES = [
    { id: '20', place: 'Kolkata · West Bengal', title: 'Adi Ganga', text: 'The old course of the Ganga, remembered in the Mangal Kavyas and still a site of ritual bathing near Kalighat — now carrying sewage under the metro line.' },
    { id: '44', place: 'Junagadh · Gujarat', title: 'Damodar Kund', text: 'A sacred kund at the foot of Girnar, tied to Krishna, the Skanda Purana and the poet-saint Narsinh Mehta. The devotion that sustains it also pollutes it.' },
    { id: '65', place: 'Erode · Tamil Nadu', title: 'Kalingarayan Canal', text: 'A thirteenth-century river link built by a Kongu chieftain, sung about in local songs — and today a carrier of textile effluents.' }
  ];
  const cs = $('#cases');
  if (cs) cs.innerHTML = CASES.map(c => {
    const r = R.find(x => x.id === c.id) || {}, img = r.photo ? `<img src="${r.photo}" alt="${esc(c.title)}" loading="lazy" decoding="async">` : I.hero(r.type || 'canal', +c.id, false);
    return `<a class="card case lift rv" href="map.html?wb=${c.id}"><div class="ph">${img}</div><div class="bd"><span class="meta">${c.place}</span><h3>${c.title}</h3><p>${c.text}</p><span class="go">Open in the deep map ${I.ui('next')}</span></div></a>`;
  }).join('');

  // team strip
  const ts = $('#teamStrip'), T = (window.DM_SITE || {}).TEAM || [];
  if (ts) ts.innerHTML = T.map(m => `<a href="team.html#${m.id}"><img src="${m.photo}" alt="" loading="lazy" width="48" height="48"><span><b>${m.name}</b><small>${m.role}</small></span></a>`).join('');
})();
