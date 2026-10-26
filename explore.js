/* Explore page: an India map of the project states, state cards, and a filterable collection. */
(function () {
  'use strict';
  const I = window.DM_ICONS, R = window.DM_RECORDS || [], $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const K = R.LAYERS || ['historical', 'cultural', 'literary', 'environmental'];
  const ORDER = ['lake', 'pond', 'tank', 'canal', 'channel', 'dam'];
  const byState = {}; R.forEach(r => (byState[r.state] = byState[r.state] || []).push(r));

  /* ---------- India map (equirectangular, cos-latitude corrected) ---------- */
  const G = window.DM_GEO, wrap = $('#indiaWrap'), tip = $('#mapTip');
  if (G && wrap) {
    const W = 520, H = 580, lon0 = 68, lon1 = 97.5, lat0 = 6.5, lat1 = 37.3, k = Math.cos(22 * Math.PI / 180);
    const sx = W / ((lon1 - lon0) * k), sy = H / (lat1 - lat0), s = Math.min(sx, sy);
    const px = (lo, la) => [((lo - lon0) * k * s).toFixed(1), ((lat1 - la) * s).toFixed(1)];
    const ring = r => 'M' + r.map(c => px(c[0], c[1]).join(' ')).join('L') + 'Z';
    const path = g => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).map(p => p.map(ring).join('')).join('');
    const vw = ((lon1 - lon0) * k * s).toFixed(0), vh = ((lat1 - lat0) * s).toFixed(0);
    let svg = `<svg class="india-svg" viewBox="0 0 ${vw} ${vh}" role="img" aria-label="Map of India with the project states highlighted">`;
    G.states.features.forEach(f => {
      const n = f.properties.name, proj = !!byState[n];
      svg += `<path class="st${proj ? ' proj' : ''}" d="${path(f.geometry)}" data-n="${esc(n)}"${proj ? ` tabindex="0" role="link" aria-label="${esc(n)}: ${byState[n].length} water bodies"` : ''}/>`;
    });
    R.forEach((r, i) => { const [x, y] = px(r.lon, r.lat); svg += `<circle class="wbdot" cx="${x}" cy="${y}" r="2.2"/>${i % 4 === 0 ? `<circle class="pulse" cx="${x}" cy="${y}" r="2.2" style="animation-delay:${(i % 9) * .3}s"/>` : ''}`; });
    wrap.insertAdjacentHTML('afterbegin', svg + '</svg>');
    const go = n => { location.href = 'map.html?state=' + encodeURIComponent(n); };
    $$('.india-svg .st.proj').forEach(p => {
      p.addEventListener('click', () => go(p.dataset.n));
      p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(p.dataset.n); } });
      p.addEventListener('mousemove', e => { const b = wrap.getBoundingClientRect(); tip.textContent = `${p.dataset.n} · ${byState[p.dataset.n].length} water bodies`; tip.style.left = (e.clientX - b.left + 12) + 'px'; tip.style.top = (e.clientY - b.top + 12) + 'px'; tip.style.opacity = 1; });
      p.addEventListener('mouseleave', () => { tip.style.opacity = 0; });
    });
  }

  /* ---------- state cards ---------- */
  const sc = $('#stateCards');
  if (sc) sc.innerHTML = Object.keys(byState).sort((a, b) => byState[b].length - byState[a].length).map(n => {
    const L = byState[n], ty = ORDER.map(t => [t, L.filter(r => r.type === t).length]).filter(x => x[1]);
    return `<a class="card lift state-card2 rv" href="map.html?state=${encodeURIComponent(n)}">${I.kalash()}<span class="deva notranslate">${R.STATES[n] || ''}</span><h3>${esc(n)}</h3><span class="note">${L.length} water bodies · ${L.reduce((a, r) => a + r.done, 0)} layers written</span>
      <span class="ty">${ty.map(([t, c]) => `<span style="--c:${I.TYPES[t].color}">${I.typeIcon(t)}${c}</span>`).join('')}</span></a>`;
  }).join('');

  /* ---------- collection ---------- */
  const F = { types: new Set(), layer: null, q: '', state: 'all', sort: 'name' };
  const counts = Object.fromEntries(ORDER.map(t => [t, R.filter(r => r.type === t).length]));
  $('#typeTiles').innerHTML = ORDER.filter(t => counts[t]).map(t => `<button class="type-tile" data-t="${t}" style="--c:${I.TYPES[t].color}" aria-pressed="false">${I.typeMarker(t, null)}<b>${I.TYPES[t].plural}</b><small class="notranslate">${I.TYPES[t].native}</small><small>${counts[t]} mapped</small></button>`).join('');
  $('#layerPick').innerHTML = K.map(k => `<button data-k="${k}" style="--c:${I.LAYERS[k].color}" aria-pressed="false">${I.layerMedallion(k)}${I.LAYERS[k].name}</button>`).join('');
  $('#cState').innerHTML = '<option value="all">All states</option>' + Object.keys(byState).sort().map(n => `<option value="${esc(n)}">${esc(n)} (${byState[n].length})</option>`).join('');
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  R.forEach(r => { r.hay = norm([r.name, r.state, r.type, ...K.map(k => r.text[k])].join(' ')); });
  function render() {
    const q = norm(F.q).trim().split(/\s+/).filter(Boolean);
    let L = R.filter(r => (!F.types.size || F.types.has(r.type)) && (!F.layer || r.status[F.layer] === 'complete') && (F.state === 'all' || r.state === F.state) && q.every(w => r.hay.includes(w)));
    L.sort(F.sort === 'done' ? (a, b) => b.done - a.done || a.name.localeCompare(b.name) : F.sort === 'state' ? (a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name) : (a, b) => a.name.localeCompare(b.name));
    $('#cCount').textContent = `${L.length} of ${R.length} water bodies`;
    if (!L.length) { $('#coll').innerHTML = `<div class="empty-s" style="grid-column:1/-1">No water body matches these filters. Try removing one.</div>`; return; }
    $('#coll').innerHTML = L.map(r => {
      const T = I.TYPES[r.type];
      const TH = window.DM_THUMBS, ph = r.thumb != null && TH ? `<span class="spr" role="img" aria-label="${esc(r.name)}" style="background-image:url(${TH.src});background-size:${TH.cols * 100}% ${TH.rows * 100}%;background-position:${(r.thumb % TH.cols) / (TH.cols - 1) * 100}% ${Math.floor(r.thumb / TH.cols) / (TH.rows - 1) * 100}%"></span>` : I.hero(r.type, +r.id || 1, document.documentElement.dataset.ui === 'dark');
      const lk = F.layer && r.text[F.layer] ? `<p class="note" style="margin:.3rem 0 0">${esc(R.excerpt(r.text[F.layer], 130))}</p>` : '';
      return `<a class="wbc" href="map.html?wb=${encodeURIComponent(r.id)}" style="--c:${T.color}"><div class="ph">${ph}<span class="badge">${I.typeIcon(r.type)}${T.name}</span></div>
        <div class="bd"><h3>${esc(r.name)}</h3><span class="st">${esc(r.state)} <span class="notranslate deva">${R.STATES[r.state] || ''}</span></span>${lk}
        <span class="lyr">${K.map(k => `<i class="${r.status[k]}" style="--c:${I.LAYERS[k].color}" title="${I.LAYERS[k].name}: ${r.status[k]}"></i>`).join('')}<span style="margin-left:.3rem">${r.done}/4 layers written</span></span></div></a>`;
    }).join('');
  }
  $('#typeTiles').addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (!b) return; const t = b.dataset.t; F.types.has(t) ? F.types.delete(t) : F.types.add(t); b.setAttribute('aria-pressed', String(F.types.has(t))); render(); });
  $('#layerPick').addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (!b) return; F.layer = F.layer === b.dataset.k ? null : b.dataset.k; $$('#layerPick button').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.k === F.layer))); render(); });
  let qt; $('#cq').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { F.q = e.target.value; render(); }, 120); });
  $('#cState').addEventListener('change', e => { F.state = e.target.value; render(); });
  $('#cSort').addEventListener('change', e => { F.sort = e.target.value; render(); });
  render();
})();
