/* Parses data.js once for the content pages (home, explore, cite, FAQ). */
window.DM_RECORDS = (function () {
  'use strict';
  const I = window.DM_ICONS, P = window.DM_PHOTOS || {};
  const src = typeof waterBodiesData !== 'undefined' ? waterBodiesData : '';
  if (!src || !window.Papa) return [];
  const STATES = { 'West Bengal': 'পশ্চিমবঙ্গ', 'Odisha': 'ଓଡ଼ିଶା', 'Madhya Pradesh': 'मध्य प्रदेश', 'Gujarat': 'ગુજરાત', 'Jharkhand': 'झारखंड', 'Bihar': 'बिहार', 'Uttar Pradesh': 'उत्तर प्रदेश', 'Tamil Nadu': 'தமிழ்நாடு' };
  const K = ['historical', 'cultural', 'literary', 'environmental'];
  const rows = Papa.parse(src, { header: true, skipEmptyLines: true }).data;
  const list = rows.map(r => {
    const t = String(r.type || '').trim().toLowerCase();
    const rec = { id: String(r.id).trim(), name: String(r.name || '').trim(), state: String(r.state || '').trim(), type: I.TYPES[t] ? t : 'lake', lat: +r.lat, lon: +r.lon, status: {}, text: {} };
    K.forEach(k => {
      const html = String(r[k] || ''), txt = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const pend = !txt || /^to be updated/i.test(txt);
      rec.status[k] = pend ? (/<a\s/i.test(html) ? 'sources' : 'pending') : 'complete';
      rec.text[k] = pend ? '' : txt.replace(/Read More/gi, '').replace(/Sources:.*$/i, '').trim();
    });
    rec.done = K.filter(k => rec.status[k] === 'complete').length;
    const p = P[rec.id];
    rec.photo = p ? p.src : null;
    rec.thumb = p && p.t != null ? p.t : null; // cell in the thumbnail sheet
    rec.native = STATES[rec.state] || '';
    return rec;
  }).filter(r => r.name);
  list.STATES = STATES; list.LAYERS = K;
  list.excerpt = (t, n = 220) => { if (!t || t.length <= n) return t; t = t.slice(0, n); return t.slice(0, t.lastIndexOf(' ')) + '…'; };
  return list;
})();
