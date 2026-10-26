/* =====================================================================
   Deep Mapping of Micro Water Bodies — icon & illustration library
   All icons are original vector drawings built on Indian water motifs:
   baoli (stepwell), diya, pothi (palm-leaf manuscript), kamal (lotus),
   nauka (country boat), kund (stepped tank), nahar (canal sluice),
   nullah (meandering channel), baandh (dam) and the kalash (water pot).
   ===================================================================== */
(function () {
  const INK = '#33231a';
  const WATER = '#4f86a0';
  const PAPER = '#f7efdc';

  /* ---------- the four layers of memory ---------- */
  const LAYERS = {
    historical: { color: '#a4452c', name: 'Historical', native: 'इतिहास', hint: 'Baoli — the stepwell' },
    cultural: { color: '#cf8106', name: 'Cultural', native: 'संस्कृति', hint: 'Diya — the floating lamp' },
    literary: { color: '#2e3f7f', name: 'Literary', native: 'साहित्य', hint: 'Pothi — the palm-leaf manuscript' },
    environmental: { color: '#13735f', name: 'Environmental', native: 'पर्यावरण', hint: 'Kamal — the lotus' }
  };

  const layerGlyph = {
    historical: c => `
      <g stroke="${INK}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">
        <path d="M15 26 H19 V30.5 H23 V35 H27 V46 H15 Z" fill="${c}" fill-opacity=".22"/>
        <path d="M49 26 H45 V30.5 H41 V35 H37 V46 H49 Z" fill="${c}" fill-opacity=".22"/>
        <path d="M27 39.5 H37 V44.2 Q32 46.4 27 44.2 Z" fill="${WATER}" stroke="none"/>
        <path d="M28.6 42 q1.7 -1 3.4 0 t3.4 0" stroke="#dcecf1" stroke-width=".9" fill="none"/>
        <path d="M13 46 H51" fill="none"/>
        <path d="M26 21.6 Q26 15.2 32 14.6 Q38 15.2 38 21.6 Z" fill="${c}"/>
        <path d="M32 14.6 V11.6" fill="none"/><circle cx="32" cy="10.9" r="1" fill="${INK}"/>
        <path d="M24.2 21.6 H39.8" fill="none" stroke-width="1.6"/>
        <path d="M26.6 21.6 V26 M37.4 21.6 V26" fill="none"/>
        <path d="M29 26 V24.4 Q32 22 35 24.4 V26" fill="none"/>
      </g>`,
    cultural: c => `
      <circle cx="32" cy="26.5" r="10" fill="#f3b33a" opacity=".22"/>
      <g stroke="${INK}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
        <path d="M32 32.2 C27.6 28.6 29.4 24.4 32 18.6 C34.6 24.4 36.4 28.6 32 32.2 Z" fill="#f3b33a" stroke="#b4471c"/>
        <path d="M32 30.9 C30.4 28.7 31.2 26.7 32 24.3 C32.8 26.7 33.6 28.7 32 30.9 Z" fill="#ffe7a0" stroke="none"/>
        <path d="M19.5 34 Q32 45.5 44.5 34 Z" fill="${c}"/>
        <path d="M44 33.4 Q47.6 32.8 48.8 30 Q46.4 32.4 43.6 32.5" fill="${c}"/>
        <path d="M18.6 34 H45.4" fill="none" stroke-width="1.5"/>
        <path d="M24 37.3 Q32 41.6 40 37.3" fill="none" stroke="#f7d58a" stroke-width=".9"/>
      </g>
      <g fill="none" stroke="${WATER}" stroke-width="1.4" stroke-linecap="round">
        <path d="M16.5 44.6 q3.9 -2 7.8 0 t7.8 0 t7.8 0 t7.8 0"/>
        <path d="M21 49.2 q2.75 -1.5 5.5 0 t5.5 0 t5.5 0 t5.5 0" opacity=".7"/>
      </g>
      <circle cx="17.4" cy="38.6" r="1.7" fill="#e8891a"/><circle cx="47.2" cy="40.6" r="1.3" fill="#e8891a"/>`,
    literary: c => `
      <g transform="rotate(-9 32 34)" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round">
        <rect x="13.5" y="26.2" width="37" height="7.6" rx="3.8" fill="#ead49b"/>
        <rect x="15" y="34.8" width="37" height="7.6" rx="3.8" fill="#e4c987"/>
        <g stroke="${c}" stroke-width=".9" stroke-linecap="round" fill="none">
          <path d="M20.5 29 h8 m2.5 0 h5 m2.5 0 h7 M20.5 31.2 h4.5 m2.5 0 h9 m2.4 0 h4"/>
          <path d="M22 37.6 h6 m2.5 0 h8 m2.5 0 h6 M22 39.8 h9 m2.4 0 h4 m2.5 0 h5"/>
        </g>
        <circle cx="17.6" cy="30" r=".95" fill="${INK}" stroke="none"/>
        <circle cx="19.1" cy="38.6" r=".95" fill="${INK}" stroke="none"/>
      </g>
      <path d="M18.4 30.6 C14.6 38 15.6 45.6 21.6 48.6" fill="none" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>
      <circle cx="21.9" cy="48.8" r="1.4" fill="${c}"/>
      <g stroke="${INK}" stroke-linecap="round">
        <path d="M45 13.4 L38.6 26.2" stroke-width="1.9"/>
        <path d="M38.6 26.2 L37.3 29.2 L39.6 27.2 Z" fill="${INK}" stroke-width="1"/>
        <path d="M43.4 16.4 l2 .9" stroke="${c}" stroke-width="2.3"/>
      </g>
      <path d="M26 50 q3 -1.6 6 0 t6 0 t6 0" fill="none" stroke="${WATER}" stroke-width="1.3" stroke-linecap="round"/>`,
    environmental: c => `
      <ellipse cx="32" cy="44.6" rx="15.5" ry="3.8" fill="#5c9a6e" stroke="${INK}" stroke-width=".9"/>
      <path d="M32 44.6 L45 42.6" stroke="${INK}" stroke-width=".7" opacity=".6"/>
      <g stroke="${INK}" stroke-width="1.05" stroke-linejoin="round">
        <path d="M32 41.4 C25 41.9 19.5 38.9 17 34.4 C23.5 33.9 28.5 36.9 32 41.4 Z" fill="#e9a3b3"/>
        <path d="M32 41.4 C39 41.9 44.5 38.9 47 34.4 C40.5 33.9 35.5 36.9 32 41.4 Z" fill="#e9a3b3"/>
        <path d="M32 41.4 C26.5 38.9 23.5 33.4 24 27.4 C28.5 29.9 31.5 34.9 32 41.4 Z" fill="#f2b9c6"/>
        <path d="M32 41.4 C37.5 38.9 40.5 33.4 40 27.4 C35.5 29.9 32.5 34.9 32 41.4 Z" fill="#f2b9c6"/>
        <path d="M32 41.4 C28.6 36.4 28.6 29.4 32 22.6 C35.4 29.4 35.4 36.4 32 41.4 Z" fill="#f8d2da"/>
      </g>
      <path d="M32 39.4 V27.6" stroke="${c}" stroke-width=".7" opacity=".6"/>
      <g fill="${c}"><path d="M35.4 51.4 c2.4 -2.4 5.7 -2.4 8.1 0 c-2.4 2.4 -5.7 2.4 -8.1 0 Z"/><path d="M43.5 51.4 l2.3 -1.8 v3.6 Z"/></g>
      <circle cx="37.6" cy="51" r=".5" fill="${PAPER}"/>
      <path d="M20 51.2 q2.5 -1.4 5 0 t5 0" fill="none" stroke="${WATER}" stroke-width="1.2" stroke-linecap="round"/>`
  };

  function rosette(color) {
    let p = '';
    for (let i = 0; i < 16; i++) p += `<path d="M32 1.4 C34.7 4.3 34.7 6.6 32 8.8 C29.3 6.6 29.3 4.3 32 1.4 Z" transform="rotate(${i * 22.5} 32 32)"/>`;
    return `<g fill="${color}">${p}</g>`;
  }

  function layerMedallion(key, cls = '') {
    const L = LAYERS[key];
    return `<svg class="medallion ${cls}" viewBox="0 0 64 64" role="img" aria-label="${L.name} layer" xmlns="http://www.w3.org/2000/svg">
      ${rosette(L.color)}
      <circle cx="32" cy="32" r="27.2" fill="${L.color}"/>
      <circle cx="32" cy="32" r="24.4" fill="${PAPER}"/>
      <circle cx="32" cy="32" r="22.6" fill="none" stroke="${L.color}" stroke-width=".9" stroke-dasharray=".1 2.3" stroke-linecap="round"/>
      ${layerGlyph[key](L.color)}
    </svg>`;
  }

  /* ---------- water-body types ---------- */
  const TYPES = {
    lake: { name: 'Lake', plural: 'Lakes', native: 'झील · सरोवर', color: '#2c6a8a' },
    pond: { name: 'Pond', plural: 'Ponds', native: 'पोखर · পুকুর', color: '#3b8a55' },
    tank: { name: 'Tank', plural: 'Tanks', native: 'कुंड · तालाब', color: '#a4452c' },
    canal: { name: 'Canal', plural: 'Canals', native: 'नहर · খাল', color: '#a8740c' },
    channel: { name: 'Channel', plural: 'Channels', native: 'नाला · धारा', color: '#2f548c' },
    dam: { name: 'Dam', plural: 'Dams', native: 'बाँध', color: '#5a5878' }
  };

  const typeGlyph = {
    lake: `<path d="M3.4 12.6 H20.6 Q19 16.7 12 17 Q5 16.7 3.4 12.6 Z" fill="currentColor"/>
      <path d="M7.4 12.6 V10.4 Q12 6.2 16.6 10.4 V12.6" fill="currentColor" fill-opacity=".3"/>
      <path d="M18.8 4.2 L15.6 12.6"/>
      <path d="M2.4 20 q1.9 -1.3 3.8 0 t3.8 0 t3.8 0 t3.8 0 t3.8 0"/>`,
    pond: `<path d="M12 21.2 C6 21.2 2.8 19.6 2.8 17.7 C2.8 15.8 6 14.2 12 14.2 C18 14.2 21.2 15.8 21.2 17.7 C21.2 19.6 18 21.2 12 21.2 Z" fill="currentColor" fill-opacity=".28"/>
      <path d="M12.6 17.7 L20.4 16.2"/>
      <path d="M8.8 16.6 Q8 12.2 9.4 9.4"/>
      <path d="M9.5 2.8 C12.5 5.2 12.5 7.6 9.5 9.7 C6.5 7.6 6.5 5.2 9.5 2.8 Z" fill="currentColor"/>
      <path d="M16.6 14.6 Q17.6 11.6 16 9.6"/><path d="M16 9.6 c1.6 -.4 2.8 .3 3.3 1.6 c-1.6 .4 -2.8 -.3 -3.3 -1.6 Z" fill="currentColor"/>`,
    tank: `<rect x="3" y="3" width="18" height="18" rx="1"/>
      <rect x="6.3" y="6.3" width="11.4" height="11.4"/>
      <rect x="9.3" y="9.3" width="5.4" height="5.4" fill="currentColor" fill-opacity=".45"/>
      <path d="M3 3 L9.3 9.3 M21 3 L14.7 9.3 M3 21 L9.3 14.7 M21 21 L14.7 14.7"/>
      <path d="M12 3 V6.3 M12 17.7 V21 M3 12 H6.3 M17.7 12 H21" stroke-width="1.1"/>`,
    canal: `<path d="M4.2 21 L9.7 10.6 H14.3 L19.8 21 Z" fill="currentColor" fill-opacity=".28" stroke="none"/>
      <path d="M3 21 L9 10.6 M21 21 L15 10.6"/>
      <path d="M10.8 14.6 h2.4 M9.4 18.2 h5.2" stroke-width="1.2"/>
      <path d="M8 10.6 V4.4 M16 10.6 V4.4 M6.4 4.4 H17.6"/>
      <rect x="9.4" y="6.4" width="5.2" height="2.6" fill="currentColor" stroke="none"/>`,
    channel: `<path d="M5.5 2.5 C15 5.5 3.5 10 12 12.5 C20.5 15 8.5 19.5 17.5 21.5" stroke-width="4.4" stroke-opacity=".3"/>
      <path d="M5.5 2.5 C15 5.5 3.5 10 12 12.5 C20.5 15 8.5 19.5 17.5 21.5" stroke-width="1.3"/>
      <path d="M15.2 6.6 c1.6 -1.7 3.9 -1.7 5.5 0 c-1.6 1.7 -3.9 1.7 -5.5 0 Z M20.7 6.6 l1.6 -1.2 v2.4 Z" fill="currentColor" stroke="none"/>`,
    dam: `<path d="M2.8 4.8 q1.53 -1 3.06 0 t3.06 0 t3.06 0 t3.06 0 t3.06 0 t3.06 0"/>
      <path d="M2.8 8 H21.2 L19.2 16 H4.8 Z" fill="currentColor" fill-opacity=".3"/>
      <path d="M8 9.8 v4.2 M12 9.8 v4.2 M16 9.8 v4.2"/>
      <path d="M7.6 16 q0 3 -1.6 5 M12 16 v5 M16.4 16 q0 3 1.6 5" stroke-width="1.2"/>`
  };

  function typeIcon(key, cls = '') {
    const g = typeGlyph[key] || typeGlyph.lake;
    return `<svg class="type-ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${g}</svg>`;
  }

  // arc helper for the four-layer completeness ring
  function arc(cx, cy, r, a0, a1) {
    const rad = a => (a - 90) * Math.PI / 180;
    const x0 = cx + r * Math.cos(rad(a0)), y0 = cy + r * Math.sin(rad(a0));
    const x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
    return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }

  // marker medallion; status = {historical:'complete'|'sources'|'pending', ...}
  function typeMarker(key, status) {
    const T = TYPES[key] || TYPES.lake;
    const order = ['historical', 'cultural', 'literary', 'environmental'];
    const ring = order.map((k, i) => {
      const s = status ? status[k] : 'pending';
      const col = LAYERS[k].color;
      const d = arc(24, 24, 21.4, i * 90 + 8, i * 90 + 82);
      if (s === 'complete') return `<path d="${d}" stroke="${col}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
      if (s === 'sources') return `<path d="${d}" stroke="${col}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="1 3.2" opacity=".9"/>`;
      return `<path d="${d}" stroke="${col}" stroke-width="1.4" fill="none" opacity=".28"/>`;
    }).join('');
    return `<svg viewBox="0 0 48 48" class="wb-medal" aria-hidden="true">
      <circle cx="24" cy="24" r="23.4" fill="rgba(247,239,220,.72)"/>
      ${ring}
      <circle cx="24" cy="24" r="17.4" fill="${PAPER}" stroke="${T.color}" stroke-width="2"/>
      <circle cx="24" cy="24" r="15.2" fill="none" stroke="${T.color}" stroke-width=".6" stroke-dasharray=".1 1.8" stroke-linecap="round"/>
      <g transform="translate(13.2 13.2) scale(.9)" color="${T.color}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${typeGlyph[key] || typeGlyph.lake}</g>
    </svg>`;
  }

  /* ---------- kalash state pin ---------- */
  function kalash() {
    let leaves = '';
    [-74, -44, -15, 15, 44, 74].forEach(a => {
      leaves += `<path d="M28 18.6 C25.3 14.6 25.6 9.6 28 6.2 C30.4 9.6 30.7 14.6 28 18.6 Z" transform="rotate(${a} 28 18.6)" fill="#7fa65a" stroke="#2d4a24" stroke-width=".6"/>`;
    });
    return `<svg viewBox="0 0 56 72" class="kalash" aria-hidden="true">
      <defs><linearGradient id="kpin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b4583"/><stop offset="1" stop-color="#16244a"/></linearGradient>
      <radialGradient id="kgold" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#ffe3a3"/><stop offset=".55" stop-color="#e2ad48"/><stop offset="1" stop-color="#a8761f"/></radialGradient></defs>
      <path d="M28 70 C28 70 5 45.5 5 27.4 A23 23 0 1 1 51 27.4 C51 45.5 28 70 28 70 Z" fill="url(#kpin)" stroke="#e2b04a" stroke-width="2"/>
      <circle cx="28" cy="27.4" r="19.2" fill="none" stroke="#e2b04a" stroke-width=".7" stroke-dasharray=".1 2" stroke-linecap="round"/>
      ${leaves}
      <ellipse cx="28" cy="14.6" rx="3.6" ry="4" fill="#9a6a3a" stroke="#4b2e17" stroke-width=".6"/>
      <rect x="21.6" y="17.6" width="12.8" height="2.6" rx="1.2" fill="url(#kgold)" stroke="#7a5214" stroke-width=".5"/>
      <path d="M24.4 20.2 H31.6 V23 H24.4 Z" fill="url(#kgold)" stroke="#7a5214" stroke-width=".5"/>
      <path d="M18 32 C18 26.2 22.4 22.8 28 22.8 C33.6 22.8 38 26.2 38 32 C38 37.6 33.6 41.4 28 41.4 C22.4 41.4 18 37.6 18 32 Z" fill="url(#kgold)" stroke="#7a5214" stroke-width=".6"/>
      <path d="M19.2 29.4 Q28 32.8 36.8 29.4" fill="none" stroke="#a4452c" stroke-width="1.1"/>
      <path d="M19.4 34.2 Q28 37.4 36.6 34.2" fill="none" stroke="#a4452c" stroke-width=".6" stroke-dasharray=".1 1.6" stroke-linecap="round"/>
      <circle cx="28" cy="31.6" r="1.3" fill="#a4452c"/>
      <path d="M21.4 44.6 q3.3 -1.6 6.6 0 t6.6 0" fill="none" stroke="#9cc3d2" stroke-width="1.1" stroke-linecap="round"/>
    </svg>`;
  }

  /* ---------- logo: the kund-kolam mark ---------- */
  function logo(cls = '') {
    const sq = s => `M32 ${32 - s} L${32 + s} 32 L32 ${32 + s} L${32 - s} 32 Z`;
    return `<svg class="logo-mark ${cls}" viewBox="0 0 64 64" aria-hidden="true">
      <defs><radialGradient id="lgw" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#7fb2c4"/><stop offset="1" stop-color="#2c6a8a"/></radialGradient></defs>
      <circle cx="32" cy="32" r="30.5" fill="#1f3364"/>
      <circle cx="32" cy="32" r="28.4" fill="none" stroke="#e2b04a" stroke-width="1"/>
      <circle cx="32" cy="32" r="26.4" fill="none" stroke="#e2b04a" stroke-width=".8" stroke-dasharray=".1 2.6" stroke-linecap="round"/>
      <path class="lg-draw" d="${sq(22)}" fill="none" stroke="#e2b04a" stroke-width="1.4"/>
      <path class="lg-draw" d="${sq(16)}" fill="none" stroke="#e2b04a" stroke-width="1.2"/>
      <path d="${sq(10)}" fill="url(#lgw)" stroke="#e2b04a" stroke-width="1.2"/>
      <path d="M32 10 V16 M54 32 H48 M32 54 V48 M10 32 H16" stroke="#e2b04a" stroke-width="1.1"/>
      <g fill="#e2b04a"><circle cx="21" cy="21" r="1.3"/><circle cx="43" cy="21" r="1.3"/><circle cx="21" cy="43" r="1.3"/><circle cx="43" cy="43" r="1.3"/></g>
      <path d="M32 36.6 C29.6 34 29.8 30.6 32 27 C34.2 30.6 34.4 34 32 36.6 Z" fill="#f6d3dc" stroke="#7a3b4c" stroke-width=".6"/>
      <path d="M32 36.6 C29 36.4 27 34.6 26.4 32.4 C28.8 32.4 30.8 34 32 36.6 Z M32 36.6 C35 36.4 37 34.6 37.6 32.4 C35.2 32.4 33.2 34 32 36.6 Z" fill="#eaa3b4" stroke="#7a3b4c" stroke-width=".6"/>
    </svg>`;
  }

  /* ---------- compass rose (rotates with the map) ---------- */
  function compassRose() {
    const pt = (rot, len, w, c1, c2) => `<g transform="rotate(${rot} 50 50)"><path d="M50 ${50 - len} L${50 + w} 50 L50 50 Z" fill="${c1}"/><path d="M50 ${50 - len} L${50 - w} 50 L50 50 Z" fill="${c2}"/></g>`;
    let ticks = '';
    for (let i = 0; i < 72; i++) ticks += `<path d="M50 ${i % 9 === 0 ? 5.5 : 6.6} V8.6" transform="rotate(${i * 5} 50 50)"/>`;
    return `<svg viewBox="0 0 100 100" class="rose" aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="var(--rose-bg)" stroke="var(--gold)" stroke-width="1.2"/>
      <g stroke="var(--ink-2)" stroke-width=".7">${ticks}</g>
      <circle cx="50" cy="50" r="36" fill="none" stroke="var(--gold)" stroke-width=".6" stroke-dasharray=".1 2.4" stroke-linecap="round"/>
      ${[45, 135, 225, 315].map(r => pt(r, 26, 5, 'var(--ink-3)', 'var(--rose-dim)')).join('')}
      ${[90, 180, 270].map(r => pt(r, 36, 6.4, 'var(--neel)', 'var(--neel-2)')).join('')}
      ${pt(0, 38, 6.6, '#a4452c', '#d0674a')}
      <circle cx="50" cy="50" r="4.4" fill="var(--gold)" stroke="var(--ink)" stroke-width=".6"/>
      <text x="50" y="21.5" text-anchor="middle" class="rose-n">उ</text>
    </svg>`;
  }


  /* ---------- the fish narrator: four Indian fish, one persona per layer ----------
     historical    — golden mahseer, aged: white whiskers, bushy brow, round spectacles, a sealed scroll
     cultural      — rohu dressed as a Bengali wedding "tattva" fish: turmeric, alpana, garland, tilak, nath
     literary      — hilsa (ilish), scholarly: square spectacles, quill behind the gill, open palm-leaf pothi
     environmental — magur catfish, distressed: worried brow, tears, gasping bubbles, murky water, plastic
     guide         — a small pool barb that swims on the home page                                        */
  function scaleArcs(x0, x1, cx, cy, rx, ry, step, r, col, op) {
    let d = '';
    for (let row = 0, y = cy - ry * .62; y <= cy + ry * .62; y += step * .8, row++) {
      for (let x = x0 + (row % 2 ? step / 2 : 0); x <= x1; x += step) {
        const k = (x - cx) / rx; if (Math.abs(k) >= 1) continue;
        const h = ry * Math.sqrt(1 - k * k) * .78; if (Math.abs(y - cy) > h - r) continue;
        d += `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r} ${r} 0 0 0 ${2 * r} 0`;
      }
    }
    return `<path d="${d}" fill="none" stroke="${col}" stroke-width=".9" opacity="${op}"/>`;
  }
  const FISH = {
    historical() {
      const K = '#3a2414', G = '#e3b45a', D = '#c2662e';
      return `
      <path d="M88 45 C96 37 103 28 113 19 C110 33 108 39 104 45 C108 51 110 57 113 71 C103 62 96 53 88 45 Z" fill="${D}" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M46 23 C52 9 64 7 72 22 Z" fill="${D}" stroke="${K}" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M12 48 C13 31 33 20 56 20 C75 20 87 33 91 45 C87 57 75 70 56 70 C33 70 13 64 12 48 Z" fill="${G}" stroke="${K}" stroke-width="1.8"/>
      <path d="M26 30 C40 21 64 19 84 33 C66 28 46 28 26 33 Z" fill="#b9773a" opacity=".5"/>
      <path d="M22 60 C38 67 62 68 82 57 C64 64 40 65 22 60 Z" fill="#f6e3b0"/>
      ${scaleArcs(46, 86, 52, 45, 40, 25, 9, 4.2, K, .32)}
      <path d="M38 27 C45 37 45 54 38 65" fill="none" stroke="${K}" stroke-width="1.4"/>
      <path d="M42 55 C46 66 56 68 60 61 C53 61 47 59 42 55 Z" fill="${D}" stroke="${K}" stroke-width="1"/>
      <path d="M64 67 C66 74 72 76 75 70 Z" fill="${D}" stroke="${K}" stroke-width="1"/>
      <g transform="translate(48 72) rotate(-10)"><rect width="24" height="7.4" rx="3.7" fill="#f3e2b4" stroke="${K}" stroke-width="1.1"/><path d="M5 3.7 h14" stroke="${K}" stroke-width=".7" opacity=".5"/><circle cx="12" cy="8" r="2.8" fill="#a4452c" stroke="${K}" stroke-width=".7"/></g>
      <path d="M12 48 Q15 52 20 51" fill="none" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/>
      <g stroke-linecap="round" fill="none"><path d="M15 50 C10 52 6 56 5 62 C5 65 7 66 8 64 M18 52 C15 56 15 61 13 66 C12 68 14 69 15 67" stroke="${K}" stroke-width="2.8"/><path d="M15 50 C10 52 6 56 5 62 C5 65 7 66 8 64 M18 52 C15 56 15 61 13 66 C12 68 14 69 15 67" stroke="#fffaf0" stroke-width="1.5"/></g>
      <circle cx="29" cy="39" r="5.4" fill="#fff" stroke="${K}" stroke-width=".8"/><circle cx="28" cy="39.6" r="2.8" fill="${K}"/><circle cx="27" cy="38.4" r=".9" fill="#fff"/>
      <circle cx="29" cy="39" r="8" fill="none" stroke="${K}" stroke-width="1.8"/>
      <path d="M37 38 C44 35 48 40 46 47" fill="none" stroke="${K}" stroke-width=".9"/>
      <g stroke-linecap="round" fill="none"><path d="M20 32 Q25 26 31 29 Q35 26 39 30" stroke="${K}" stroke-width="4.2"/><path d="M20 32 Q25 26 31 29 Q35 26 39 30" stroke="#fffaf0" stroke-width="2.6"/></g>
      <path d="M19 44 q1.6 2 0 4 M22 46 q1.4 1.6 0 3.2" fill="none" stroke="${K}" stroke-width=".7" opacity=".55"/>`;
    },
    cultural() {
      const K = '#6b2e10', Y = '#f2c14e', R = '#d0502a', V = '#c0392b';
      let beads = '';
      for (let i = 0; i < 9; i++) { const a = -1.12 + i * .28, x = 22 + 21 * Math.cos(a), y = 45 + 23 * Math.sin(a); beads += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="${i % 2 ? '#f39c12' : '#e8641c'}" stroke="${K}" stroke-width=".55"/>`; }
      let flower = ''; for (let i = 0; i < 6; i++) flower += `<ellipse cx="66" cy="40.5" rx="1.8" ry="4" fill="${V}" transform="rotate(${i * 60} 66 45)"/>`;
      return `
      <path d="M89 45 C97 37 103 29 112 21 C109 34 107 40 104 45 C107 50 109 56 112 69 C103 61 97 53 89 45 Z" fill="${R}" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M48 23 C52 8 66 6 74 23 Z" fill="${R}" stroke="${K}" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M12 46 C15 29 36 21 57 22 C76 23 88 35 92 45 C88 55 76 67 57 68 C36 69 15 63 12 46 Z" fill="${Y}" stroke="${K}" stroke-width="1.8"/>
      ${scaleArcs(46, 86, 52, 45, 40, 23, 8, 3.6, '#c97a12', .45)}
      <path d="M46 31 C56 37 68 37 80 31 M46 59 C56 53 68 53 80 59" fill="none" stroke="${V}" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M44 45 C56 41 74 41 88 45" fill="none" stroke="#fffaf0" stroke-width="1.8" stroke-dasharray=".1 3.4" stroke-linecap="round"/>
      <path d="M50 34 C58 39 68 39 76 34 M50 56 C58 51 68 51 76 56" fill="none" stroke="#fffaf0" stroke-width="1.3" stroke-dasharray=".1 2.6" stroke-linecap="round"/>
      ${flower}<circle cx="66" cy="45" r="2.4" fill="#e2b04a" stroke="${K}" stroke-width=".5"/>
      <path d="M42 55 C46 65 56 67 60 60 C53 60 47 58 42 55 Z" fill="${R}" stroke="${K}" stroke-width="1"/>
      ${beads}
      <path d="M12 47 Q16 51.5 21 49" fill="none" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="15.5" cy="50" r="3.8" fill="none" stroke="#d9a520" stroke-width="1.5"/><circle cx="13.6" cy="53.4" r="1.2" fill="${V}"/>
      <circle cx="28" cy="40" r="5.4" fill="#fff" stroke="${K}" stroke-width=".8"/><circle cx="27" cy="40.6" r="2.9" fill="#2b1e14"/><circle cx="26" cy="39.4" r=".9" fill="#fff"/>
      <path d="M33 39.2 L38.5 37" stroke="#2b1e14" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M24.5 27 V33.4" stroke="${V}" stroke-width="2.4" stroke-linecap="round"/><circle cx="24.5" cy="35.3" r="1.2" fill="#d9a520"/>`;
    },
    literary() {
      const K = '#1d2a5a', S = '#d6dcef', B = '#8a9bd0';
      let spots = ''; for (let i = 0; i < 5; i++) spots += `<circle cx="${52 + i * 6}" cy="${33 + i * .6}" r="1.2" fill="${K}" opacity=".35"/>`;
      return `
      <path d="M91 45 C99 37 106 27 117 16 C113 32 110 39 106 45 C110 51 113 58 117 74 C106 63 99 53 91 45 Z" fill="${B}" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M50 26 C54 15 62 14 67 26 Z" fill="${B}" stroke="${K}" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M9 46 C18 30 42 24 63 25 C80 26 90 36 94 45 C90 54 80 64 63 65 C42 66 18 61 9 46 Z" fill="${S}" stroke="${K}" stroke-width="1.8"/>
      <path d="M22 33 C40 25 66 23 86 36 C66 30 44 30 22 37 Z" fill="${B}" opacity=".75"/>
      <path d="M22 57 C40 63 66 63 84 54" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>
      ${scaleArcs(46, 88, 52, 45, 42, 20, 7, 3, K, .2)}
      <circle cx="44" cy="35.5" r="2.7" fill="${K}"/>${spots}
      <path d="M37 30 C43 39 43 53 37 61" fill="none" stroke="${K}" stroke-width="1.3"/>
      <path d="M40 54 C44 63 52 65 56 59 C50 59 45 57 40 54 Z" fill="${B}" stroke="${K}" stroke-width="1"/>
      <path d="M9 46 Q13 49 18 48" fill="none" stroke="${K}" stroke-width="1.5" stroke-linecap="round"/>
      <g transform="translate(40 30) rotate(-38)"><path d="M0 0 L26 0" stroke="${K}" stroke-width="1.5" stroke-linecap="round"/><path d="M8 0 C12 -6 22 -6 28 0 C22 4 12 4 8 0 Z" fill="#fffaf0" stroke="${K}" stroke-width=".9"/><path d="M10 0 L27 0" stroke="${K}" stroke-width=".5"/></g>
      <circle cx="26" cy="41" r="5.2" fill="#fff" stroke="${K}" stroke-width=".8"/><circle cx="25" cy="41.6" r="2.8" fill="#2b1e14"/><circle cx="24" cy="40.4" r=".9" fill="#fff"/>
      <rect x="18.4" y="35" width="15.4" height="12.4" rx="2.6" fill="none" stroke="#2b1e14" stroke-width="1.8"/><path d="M33.8 39 L41 37" stroke="#2b1e14" stroke-width="1.2"/>
      <g transform="translate(44 66) rotate(-6)"><rect width="32" height="7" rx="3.5" fill="#ead49b" stroke="#2b1e14" stroke-width="1"/><rect x="2" y="8" width="32" height="7" rx="3.5" fill="#e4c987" stroke="#2b1e14" stroke-width="1"/>
        <path d="M6 3.5 h8 m2 0 h9 M8 11.5 h6 m2 0 h10" stroke="#2e3f7f" stroke-width=".9" stroke-linecap="round"/><circle cx="3.6" cy="3.5" r=".9" fill="#2b1e14"/><circle cx="5.6" cy="11.5" r=".9" fill="#2b1e14"/></g>`;
    },
    environmental() {
      const K = '#1d3f36', M = '#9aa585', Dk = '#6a7a58';
      return `
      <path d="M2 84 q6 -4 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0" fill="none" stroke="#7a6a3a" stroke-width="1.8" opacity=".55"/>
      <path d="M8 79 q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0" fill="none" stroke="#7a6a3a" stroke-width="1" opacity=".35"/>
      <path d="M100 49 C106 39 116 40 117 49 C116 58 106 59 100 49 Z" fill="${Dk}" stroke="${K}" stroke-width="1.4"/>
      <path d="M40 36 C56 29 78 30 94 39 L88 41 C72 35 56 35 42 38 Z" fill="${Dk}" stroke="${K}" stroke-width="1"/>
      <path d="M46 61 C62 67 80 65 94 58 L88 56 C74 61 60 62 48 59 Z" fill="${Dk}" stroke="${K}" stroke-width="1"/>
      <path d="M8 50 C9 41 20 35 38 35 L82 37 C92 38 99 43 102 49 C99 55 92 59 82 60 L38 62 C20 62 9 59 8 50 Z" fill="${M}" stroke="${K}" stroke-width="1.8"/>
      <g fill="${Dk}" opacity=".55"><ellipse cx="54" cy="43" rx="4" ry="2.2"/><ellipse cx="68" cy="52" rx="3.4" ry="2"/><ellipse cx="80" cy="44" rx="3" ry="1.8"/><ellipse cx="44" cy="54" rx="2.6" ry="1.6"/><ellipse cx="90" cy="51" rx="2.4" ry="1.4"/></g>
      <path d="M30 38 C34 44 34 55 30 60" fill="none" stroke="${K}" stroke-width="1.3"/>
      <path d="M36 56 C40 64 48 66 52 60 C46 60 41 59 36 56 Z" fill="${Dk}" stroke="${K}" stroke-width="1"/>
      <g fill="none" stroke="#33231a" stroke-width="1.4" stroke-linecap="round"><path d="M11 47 C6 40 6 31 12 23"/><path d="M14 45 C14 36 20 30 27 27"/><path d="M10 53 C3 57 2 65 6 73"/><path d="M14 56 C12 64 16 71 22 76"/></g>
      <path d="M9 53 Q12.5 50 16 53" fill="none" stroke="#33231a" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="23" cy="45" r="4.4" fill="#fff" stroke="${K}" stroke-width=".8"/><circle cx="22.4" cy="45.8" r="2.4" fill="#2b1e14"/><circle cx="21.6" cy="44.8" r=".7" fill="#fff"/>
      <path d="M17 39.5 Q22 35 28.5 38.6" fill="none" stroke="#2b1e14" stroke-width="2" stroke-linecap="round"/>
      <path d="M21 51 C19.6 53.6 19.8 55.2 21.2 56 C22.6 55.2 22.6 53.6 21 51 Z" fill="#7fb2c4" stroke="#2e6b84" stroke-width=".5"/>
      <path d="M33 30 C31.6 32.6 31.8 34.2 33.2 35 C34.6 34.2 34.6 32.6 33 30 Z" fill="#7fb2c4" stroke="#2e6b84" stroke-width=".5"/>
      <g fill="none" stroke="#2e6b84" stroke-width="1" opacity=".7"><circle cx="16" cy="16" r="2.8"/><circle cx="22" cy="8" r="1.9"/><circle cx="14" cy="4" r="1.3"/></g>
      <g transform="translate(92 6) rotate(28)"><rect x="0" y="4" width="9" height="20" rx="3" fill="#e4eef0" stroke="#33231a" stroke-width=".9" opacity=".95"/><rect x="2.5" y="0" width="4" height="4.4" rx="1" fill="#13735f" stroke="#33231a" stroke-width=".6"/><rect x="0" y="11" width="9" height="5" fill="#7fb2c4" opacity=".8"/></g>
      <path d="M58 76 c3 -2 8 -2 10 1 c-3 2 -7 2 -10 -1 Z" fill="#c9b37a" opacity=".7"/>`;
    },
    guide() {
      const C = '#1c6e7d';
      return `
      <path d="M48 24 C54 8 72 9 80 26 Z" fill="${C}" opacity=".85"/>
      <path d="M16 46 C28 18 74 14 92 40 L113 23 C108 37 108 53 113 67 L92 52 C74 78 28 74 16 46 Z" fill="#f4ead2" stroke="${C}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M92 40 L113 23 C108 37 108 53 113 67 L92 52 Z" fill="${C}" opacity=".35"/>
      <g fill="none" stroke="${C}" stroke-width="1" opacity=".45">${[0, 1, 2, 3].map(i => `<path d="M${54 + i * 8} 30 q5 8 0 16 M${58 + i * 8} 38 q5 8 0 16"/>`).join('')}</g>
      <path d="M44 30 Q52 45 44 60" stroke="${C}" stroke-width="1.6" fill="none"/>
      <path d="M52 56 C58 66 68 68 72 60 C66 62 60 60 52 56 Z" fill="${C}" opacity=".7"/>
      <circle cx="35" cy="40" r="5.6" fill="#fff"/><circle cx="34" cy="40.6" r="3" fill="#33231a"/><circle cx="33" cy="39.4" r="1" fill="#fff"/>
      <path d="M18 49 Q22 53 27 50" stroke="#33231a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    }
  };
  const FISH_NAME = {
    historical: { sp: 'Mahseer', native: 'महासीर', persona: 'Aged and reflective' },
    cultural: { sp: 'Rohu', native: 'রুই', persona: 'Adorned like a wedding fish' },
    literary: { sp: 'Hilsa', native: 'ইলিশ', persona: 'Scholarly, with pothi and quill' },
    environmental: { sp: 'Magur', native: 'মাগুর', persona: 'Distressed in murky water' },
    guide: { sp: 'Pool barb', native: 'पुठी', persona: 'Your guide' }
  };
  function fish(persona, cls = '') {
    const f = FISH[persona] ? persona : 'guide', N = FISH_NAME[f];
    return `<svg class="fish fish-${f} ${cls}" viewBox="0 0 120 90" role="img" aria-label="Fish narrator: ${N.sp}, ${N.persona.toLowerCase()}">${FISH[f]()}</svg>`;
  }
  // a fish narrator seated on a soft disc in the layer's colour — used where the map shows a layer
  function fishBadge(k, cls = '') {
    const L = LAYERS[k] || { color: '#1c6e7d', name: 'Guide' };
    return `<svg class="fish-badge ${cls}" viewBox="0 0 64 64" overflow="visible" role="img" aria-label="${L.name} layer — ${FISH_NAME[k] ? FISH_NAME[k].sp : 'fish'} narrator">
      <circle cx="32" cy="32" r="29" fill="#fbf5e6" stroke="${L.color}" stroke-width="2.4"/>
      <circle cx="32" cy="32" r="25.4" fill="${L.color}" fill-opacity=".1" stroke="${L.color}" stroke-width=".9" stroke-dasharray=".1 2.6" stroke-linecap="round"/>
      <svg x="-5" y="6" width="74" height="55.5" viewBox="0 0 120 90" overflow="visible">${(FISH[k] || FISH.guide)()}</svg>
    </svg>`;
  }

  /* ---------- line UI icons ---------- */
  const UI = {
    home: '<path d="M4.5 11 Q12 3.4 19.5 11"/><path d="M12 5.4 V2.8"/><path d="M3 11 H21"/><path d="M5.6 11 V20 M18.4 11 V20"/><path d="M3.4 20.2 H20.6"/><path d="M9.2 20 V15.6 Q12 12.8 14.8 15.6 V20"/>',
    india: '<circle cx="12" cy="12" r="9"/><path d="M12 3 L13.6 10.4 L21 12 L13.6 13.6 L12 21 L10.4 13.6 L3 12 L10.4 10.4 Z" fill="currentColor" fill-opacity=".18"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    list: '<path d="M10 6 H20.5 M10 12 H20.5 M10 18 H20.5"/><path d="M5.5 4.4 L7.1 6 L5.5 7.6 L3.9 6 Z M5.5 10.4 L7.1 12 L5.5 13.6 L3.9 12 Z M5.5 16.4 L7.1 18 L5.5 19.6 L3.9 18 Z" fill="currentColor"/>',
    lexicon: '<rect x="3" y="6.4" width="18" height="4.6" rx="2.3"/><rect x="3" y="12.6" width="18" height="4.6" rx="2.3"/><path d="M7.4 8.7 h.1 M7.4 14.9 h.1" stroke-width="2.2"/><path d="M10 8.7 h7.5 M10 14.9 h5.5" stroke-width="1"/><path d="M7.4 8.8 C4.8 14 5.6 18.6 8.6 21"/>',
    help: '<path d="M2.6 12 C6.6 6.4 13.6 6.4 17.8 12 C13.6 17.6 6.6 17.6 2.6 12 Z"/><path d="M17.8 12 L21.6 8.4 V15.6 Z"/><circle cx="7" cy="11" r=".9" fill="currentColor"/><path d="M11 9.6 q1.4 2.4 0 4.8" stroke-width="1.2"/>',
    tour: '<path d="M3 15.6 H21 Q19.2 19.8 12 19.8 Q4.8 19.8 3 15.6 Z" fill="currentColor" fill-opacity=".18"/><path d="M11.4 15.6 V2.8"/><path d="M11.8 3.6 Q19.4 8.6 11.8 13.6 Z" fill="currentColor" fill-opacity=".25"/><path d="M11 5 Q6.2 9 11 13"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6 V5 M12 19 V21.4 M2.6 12 H5 M19 12 H21.4 M5.4 5.4 L7 7 M17 17 L18.6 18.6 M5.4 18.6 L7 17 M17 7 L18.6 5.4"/>',
    terrain: '<path d="M2 19.4 L8.6 8.8 L13 15.2 L16 11.2 L22 19.4 Z" fill="currentColor" fill-opacity=".16"/><path d="M7 11.4 L8.6 8.8 L10.4 11.6 L9.2 11 Z" fill="currentColor"/>',
    tilt: '<path d="M12 3 L20 7.5 V16.5 L12 21 L4 16.5 V7.5 Z"/><path d="M4 7.5 L12 12 L20 7.5 M12 12 V21"/>',
    plus: '<path d="M12 5 V19 M5 12 H19"/>',
    minus: '<path d="M5 12 H19"/>',
    close: '<path d="M6 6 L18 18 M18 6 L6 18"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.2"/><path d="M15.2 15.2 L20.5 20.5"/>',
    prev: '<path d="M15 5 L8 12 L15 19"/>',
    next: '<path d="M9 5 L16 12 L9 19"/>',
    back: '<path d="M10 6 L4 12 L10 18 M4.5 12 H20"/>',
    link: '<path d="M10.2 13.8 a4 4 0 0 0 5.7 0 l3 -3 a4 4 0 0 0 -5.7 -5.7 l-1.2 1.2"/><path d="M13.8 10.2 a4 4 0 0 0 -5.7 0 l-3 3 a4 4 0 0 0 5.7 5.7 l1.2 -1.2"/>',
    locate: '<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><path d="M12 2 V5.5 M12 18.5 V22 M2 12 H5.5 M18.5 12 H22"/>',
    play: '<path d="M7 4.6 L19 12 L7 19.4 Z" fill="currentColor"/>',
    pause: '<path d="M8 5 V19 M16 5 V19" stroke-width="3"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor"/>',
    expand: '<path d="M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15"/>',
    layers: '<path d="M12 3 L21 8 L12 13 L3 8 Z"/><path d="M3 12.4 L12 17.4 L21 12.4"/><path d="M3 16.4 L12 21.4 L21 16.4" opacity=".55"/>',
    chevron: '<path d="M6 9 L12 15 L18 9"/>',
    pin: '<path d="M12 21.4 C12 21.4 5 14.6 5 9.4 a7 7 0 0 1 14 0 C19 14.6 12 21.4 12 21.4 Z"/><circle cx="12" cy="9.4" r="2.4"/>',
    image: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3.5 16 L9 11 L13 14.6 L16 12 L20.5 16"/><circle cx="16" cy="8.6" r="1.6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12 H21 M12 3 C15 6 15.6 9 15.6 12 C15.6 15 15 18 12 21 C9 18 8.4 15 8.4 12 C8.4 9 9 6 12 3 Z"/>',
    lang: '<path d="M3 5 H12 M7.5 3 V5 M5 5 C5.6 8.6 7.6 11.2 10.6 12.6 M10 5 C9.2 9.4 6.6 12.4 3.4 13.6"/><path d="M12.6 21 L16.6 11 L20.6 21 M14 17.6 H19.2"/>',
    a11y: '<circle cx="12" cy="12" r="9.2"/><circle cx="12" cy="7.4" r="1.4" fill="currentColor"/><path d="M7 10 L12 11 L17 10 M12 11 V14.4 L9.6 18.6 M12 14.4 L14.4 18.6"/>',
    menu: '<path d="M4 7 H20 M4 12 H20 M4 17 H14"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.6 7 L12 13 L20.4 7"/>',
    copy: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2"/><path d="M15.5 8.5 V5.5 A1.5 1.5 0 0 0 14 4 H5.5 A1.5 1.5 0 0 0 4 5.5 V14 A1.5 1.5 0 0 0 5.5 15.5 H8.5"/>',
    check: '<path d="M5 12.5 L10 17.5 L19 7"/>',
    quote: '<path d="M9.6 7 C6.6 8 5 10.4 5 13.6 V17 H9.6 V12.6 H7.2 C7.4 10.8 8.4 9.6 10.2 9 Z M18.6 7 C15.6 8 14 10.4 14 13.6 V17 H18.6 V12.6 H16.2 C16.4 10.8 17.4 9.6 19.2 9 Z" fill="currentColor" fill-opacity=".2"/>',
    external: '<path d="M14 4 H20 V10 M20 4 L11 13"/><path d="M18 14 V19 A1 1 0 0 1 17 20 H5 A1 1 0 0 1 4 19 V7 A1 1 0 0 1 5 6 H10"/>',
    moon: '<path d="M19.5 14.6 A8 8 0 0 1 9.4 4.5 A8 8 0 1 0 19.5 14.6 Z"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3 A9 9 0 0 1 12 21 Z" fill="currentColor"/>',
    textsize: '<path d="M3 19 L8 6 L13 19 M4.8 14.6 H11.2"/><path d="M14.4 19 L17.6 11 L20.8 19 M15.4 16.4 H19.8"/>',
    motion: '<path d="M3 12 q2.25 -4 4.5 0 t4.5 0 t4.5 0 t4.5 0"/><path d="M4 18 L20 6" stroke-width="1.4"/>',
    font: '<path d="M5 19 L10 5 L15 19 M6.8 14 H13.2"/><path d="M16.5 19 V11.5 M16.5 13.5 C17.5 11.8 19 11.5 20.5 12"/>',
    underline: '<path d="M7 4 V11 A5 5 0 0 0 17 11 V4"/><path d="M5 20 H19"/>',
    reset: '<path d="M4.5 12 A7.5 7.5 0 1 0 7 6.4"/><path d="M4 4 V8.4 H8.4"/>',
    shield: '<path d="M12 3 L19.5 6 V11.5 C19.5 16 16.4 19.4 12 21 C7.6 19.4 4.5 16 4.5 11.5 V6 Z"/><path d="M8.6 12 L11 14.4 L15.6 9.6"/>',
    team: '<circle cx="8.5" cy="8.5" r="3"/><circle cx="16.5" cy="9.5" r="2.5"/><path d="M3 19.5 C3.6 15.6 6 13.6 8.5 13.6 C11 13.6 13.4 15.6 14 19.5 M14.4 14.6 C17.6 14 20.4 15.8 21 19.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11 V17 M12 7.6 V7.7" stroke-width="2"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.4 A2.7 2.7 0 1 1 13.2 11.8 C12.4 12.3 12 12.9 12 13.8 M12 17 V17.1" stroke-width="1.8"/>',
    cite: '<path d="M6 3.5 H15 L19 7.5 V20.5 H6 Z"/><path d="M14.5 3.5 V8 H19 M9 12 H16 M9 15 H16 M9 18 H13"/>',
    scale: '<path d="M12 4 V20 M7 20 H17 M5 7 H19 M5 7 L2.6 13 A2.6 2.6 0 0 0 7.4 13 Z M19 7 L16.6 13 A2.6 2.6 0 0 0 21.4 13 Z"/>',
    cc: '<circle cx="12" cy="12" r="9.2"/><path d="M10.6 9.8 A3 3 0 1 0 10.6 14.2 M17 9.8 A3 3 0 1 0 17 14.2" transform="translate(-1.6 0)"/>',
    by: '<circle cx="12" cy="12" r="9.2"/><circle cx="12" cy="7.6" r="1.6"/><path d="M9.4 10.4 H14.6 V15 H13.2 V18.4 H10.8 V15 H9.4 Z"/>',
    nc: '<circle cx="12" cy="12" r="9.2"/><path d="M14.6 9.6 C14 8.6 13 8.2 12 8.2 C10.4 8.2 9.6 9.2 9.6 10.2 C9.6 12.8 14.6 11.4 14.6 14 C14.6 15 13.6 15.8 12 15.8 C10.8 15.8 9.8 15.2 9.4 14.4 M12 6.6 V8.2 M12 15.8 V17.4"/><path d="M4.6 4.6 L19.4 19.4"/>',
    remix: '<circle cx="12" cy="12" r="9.2"/><path d="M8 9 H14 A3 3 0 0 1 14 15 H9 M10 7 L8 9 L10 11 M14 17 L16 15 L14 13" transform="translate(0 0)"/>',
    sa: '<circle cx="12" cy="12" r="9.2"/><path d="M15.6 10.4 A4 4 0 1 0 15.8 13.6 M17.2 9 L15.8 11 L13.8 10"/>',
    pin2: '<path d="M12 21.4 C12 21.4 5 14.6 5 9.4 a7 7 0 0 1 14 0 C19 14.6 12 21.4 12 21.4 Z"/><circle cx="12" cy="9.4" r="2.4"/>',
    leaf: '<path d="M5 19 C5 10 10 5 19 5 C19 14 14 19 5 19 Z"/><path d="M5 19 L13 11"/>',
    code: '<path d="M8.5 7 L3.5 12 L8.5 17 M15.5 7 L20.5 12 L15.5 17 M13.4 5 L10.6 19"/>',
    sparkle: '<path d="M12 3 L13.6 10.4 L21 12 L13.6 13.6 L12 21 L10.4 13.6 L3 12 L10.4 10.4 Z"/>',
    arrowUp: '<path d="M12 19 V5 M6 11 L12 5 L18 11"/>',
    sound: '<path d="M4 9.5 H7.5 L12 5.5 V18.5 L7.5 14.5 H4 Z" fill="currentColor" fill-opacity=".18"/><path d="M15.5 9 q2 3 0 6 M18 6.5 q4 5.5 0 11"/>',
    mute: '<path d="M4 9.5 H7.5 L12 5.5 V18.5 L7.5 14.5 H4 Z" fill="currentColor" fill-opacity=".18"/><path d="M16 9.5 L21 14.5 M21 9.5 L16 14.5"/>',
    book: '<path d="M12 6.4 C9.6 4.6 6.4 4.2 3.4 4.8 V18.6 C6.4 18 9.6 18.4 12 20.2 C14.4 18.4 17.6 18 20.6 18.6 V4.8 C17.6 4.2 14.4 4.6 12 6.4 Z"/><path d="M12 6.4 V20.2"/>'
  };
  function ui(name, cls = '') {
    return `<svg class="ui-ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${UI[name] || ''}</svg>`;
  }

  /* ---------- engraved hero illustration (fallback when no photo yet) ---------- */
  function rand(seed) { let s = seed * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function hero(typeKey, seed = 1, night = false) {
    const r = rand(seed + 7);
    const T = TYPES[typeKey] || TYPES.lake;
    const sky = night ? ['#0e1a33', '#2a3d6a'] : ['#f6e6c2', '#e7bf83'];
    const hillA = night ? '#22355e' : '#c9a77a', hillB = night ? '#182848' : '#a98455';
    const water = night ? ['#1b3157', '#0d1a33'] : ['#a9c6c4', '#6f9ea6'];
    const ink = night ? '#d9bf86' : '#5a3d26';
    const hx = () => Array.from({ length: 7 }, (_, i) => `${i * 75} ${92 + r() * 34}`).join(' L');
    const fore = {
      lake: `<g fill="${ink}"><path d="M150 160 H246 Q238 176 198 177 Q158 176 150 160 Z"/><path d="M172 160 V150 Q198 132 224 150 V160 Z" opacity=".55"/><path d="M236 128 L222 162" stroke="${ink}" stroke-width="2.4"/></g>`,
      pond: `<g><ellipse cx="140" cy="172" rx="46" ry="9" fill="#5c9a6e" opacity=".9"/><ellipse cx="292" cy="182" rx="36" ry="7" fill="#5c9a6e" opacity=".85"/><path d="M140 168 C128 150 130 138 140 126 C150 138 152 150 140 168 Z" fill="#f2b9c6" stroke="${ink}" stroke-width="1"/><path d="M140 168 C122 166 112 156 110 148 C124 148 134 156 140 168 Z M140 168 C158 166 168 156 170 148 C156 148 146 156 140 168 Z" fill="#e9a3b3" stroke="${ink}" stroke-width="1"/></g>`,
      tank: `<g fill="none" stroke="${ink}" stroke-width="1.4"><path d="M60 210 L110 150 H330 L380 210"/><path d="M80 210 L122 160 H318 L360 210 M100 210 L134 170 H306 L340 210 M120 210 L146 180 H294 L320 210"/></g><g fill="${ink}" opacity=".85"><path d="M196 150 V128 Q220 104 244 128 V150 Z"/><path d="M220 106 V96"/></g>`,
      canal: `<path d="M150 210 L208 140 H232 L290 210 Z" fill="${water[0]}" opacity=".9"/><g stroke="${ink}" stroke-width="1.6" fill="none"><path d="M120 210 L204 140 M320 210 L236 140"/><path d="M200 140 V112 M240 140 V112 M194 112 H246"/></g><rect x="206" y="118" width="28" height="10" fill="${ink}"/>`,
      channel: `<path d="M120 140 C260 150 90 175 230 182 C330 188 210 205 300 212" fill="none" stroke="${water[0]}" stroke-width="16" stroke-linecap="round"/><path d="M120 140 C260 150 90 175 230 182 C330 188 210 205 300 212" fill="none" stroke="${ink}" stroke-width="1" opacity=".5"/>`,
      dam: `<g fill="${ink}" opacity=".9"><path d="M40 150 H400 L392 178 H48 Z"/></g><g fill="${water[0]}">${[90, 150, 210, 270, 330].map(x => `<path d="M${x} 154 h18 v18 h-18 Z"/>`).join('')}</g>`
    }[typeKey] || '';
    let birds = '';
    for (let i = 0; i < 4; i++) { const bx = 90 + r() * 200, by = 36 + r() * 40; birds += `<path d="M${bx} ${by} q4 -4 8 0 q4 -4 8 0"/>`; }
    return `<svg viewBox="0 0 440 210" preserveAspectRatio="xMidYMid slice" class="hero-svg" aria-hidden="true">
      <defs>
        <linearGradient id="hs${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
        <linearGradient id="hw${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${water[0]}"/><stop offset="1" stop-color="${water[1]}"/></linearGradient>
        <pattern id="hh${seed}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0 V5" stroke="${ink}" stroke-width=".7" opacity=".35"/></pattern>
      </defs>
      <rect width="440" height="210" fill="url(#hs${seed})"/>
      <circle cx="${300 + r() * 70}" cy="${58 + r() * 14}" r="22" fill="${night ? '#efe3c4' : '#f4b545'}" opacity=".95"/>
      <g fill="none" stroke="${ink}" stroke-width="1.2" opacity=".6">${birds}</g>
      <path d="M0 ${110 + r() * 10} L${hx()} L440 ${100 + r() * 20} V210 H0 Z" fill="${hillA}" opacity=".65"/>
      <path d="M0 ${128 + r() * 8} C120 ${100 + r() * 20} 200 ${130 + r() * 10} 300 ${118 + r() * 10} S420 ${120 + r() * 8} 440 ${128 + r() * 6} V210 H0 Z" fill="${hillB}"/>
      <path d="M0 ${128} C120 ${108} 200 ${136} 300 ${122} S420 ${126} 440 ${130} V210 H0 Z" fill="url(#hh${seed})"/>
      <rect y="140" width="440" height="70" fill="url(#hw${seed})"/>
      <g stroke="${night ? '#e8d9b0' : '#fff6dc'}" stroke-width="1.4" opacity=".7" stroke-linecap="round">${Array.from({ length: 9 }, (_, i) => `<path d="M${40 + r() * 360} ${150 + i * 6.5} h${12 + r() * 30}"/>`).join('')}</g>
      ${fore}
      <rect x="6" y="6" width="428" height="198" fill="none" stroke="${ink}" stroke-width="1" opacity=".5"/>
      <rect x="10" y="10" width="420" height="190" fill="none" stroke="${ink}" stroke-width=".5" opacity=".4"/>
      <g transform="translate(386 156)"><circle r="22" fill="${PAPER}" stroke="${T.color}" stroke-width="2"/><g transform="translate(-12 -12)" color="${T.color}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${typeGlyph[typeKey] || ''}</g></g>
    </svg>`;
  }

  window.DM_ICONS = { LAYERS, TYPES, fish, fishBadge, FISH_NAME, layerMedallion, typeIcon, typeMarker, kalash, logo, compassRose, ui, hero };
})();
