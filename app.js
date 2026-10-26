/* =====================================================================
   Deep Mapping of Micro Water Bodies — 3D atlas
   MapLibre GL (globe + terrain + extrusions) driven by data.js
   ===================================================================== */
(function () {
  'use strict';

  const I = window.DM_ICONS;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const LKEYS = ['historical', 'cultural', 'literary', 'environmental'];
  const TYPE_ORDER = ['lake', 'pond', 'tank', 'canal', 'channel', 'dam'];
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === '1';
  const isMobile = () => innerWidth <= 760;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  // fill every [data-ico] slot with its line icon
  const paintIcons = (root = document) => root.querySelectorAll('[data-ico]').forEach(n => { n.outerHTML = I.ui(n.dataset.ico); });
  paintIcons();
  $('#logoSlot').innerHTML = I.logo();
  $('#veilLogo').innerHTML = I.logo();
  $('#roseSvg').innerHTML = I.compassRose();

  /* -------------------------------------------------------------------
     States: native names and pin positions (from the original atlas)
     ------------------------------------------------------------------- */
  const STATES = {
    'West Bengal': { native: 'পশ্চিমবঙ্গ', pin: [88.1, 22.9] },
    'Odisha': { native: 'ଓଡ଼ିଶା', pin: [84.6, 20.3] },
    'Madhya Pradesh': { native: 'मध्य प्रदेश', pin: [78.5, 23.5] },
    'Gujarat': { native: 'ગુજરાત', pin: [71.8, 22.6] },
    'Jharkhand': { native: 'झारखंड', pin: [85.3, 23.4] },
    'Bihar': { native: 'बिहार', pin: [85.6, 26.1] },
    'Uttar Pradesh': { native: 'उत्तर प्रदेश', pin: [80.6, 26.9] },
    'Tamil Nadu': { native: 'தமிழ்நாடு', pin: [78.4, 11.0] }
  };
  const normState = s => {
    const k = String(s || '').trim().toLowerCase();
    return Object.keys(STATES).find(n => n.toLowerCase() === k) || String(s || '').trim();
  };

  /* -------------------------------------------------------------------
     Data: parse data.js (unchanged CSV) into records
     ------------------------------------------------------------------- */
  function analyse(html) {
    const raw = String(html || '').trim();
    const text = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const pending = !text || /^to be updated/i.test(text) || /^data coming soon/i.test(text);
    const hasLinks = /<a\s/i.test(raw);
    return { html: raw, text, status: pending ? (hasLinks ? 'sources' : 'pending') : 'complete' };
  }
  function excerpt(text, n = 250) {
    let t = text.replace(/Read More/gi, '').replace(/Sources:.*$/i, '').replace(/\s+/g, ' ').trim();
    if (t.length <= n) return t;
    t = t.slice(0, n);
    return t.slice(0, t.lastIndexOf(' ')) + '…';
  }

  const rows = Papa.parse((typeof waterBodiesData !== 'undefined' ? waterBodiesData : window.waterBodiesData) || '', { header: true, skipEmptyLines: true }).data;
  const RECS = rows.map(r => {
    const typeKey = String(r.type || '').trim().toLowerCase();
    const rec = {
      id: String(r.id).trim(),
      type: String(r.type || '').trim(),
      typeKey: I.TYPES[typeKey] ? typeKey : 'lake',
      name: String(r.name || '').trim(),
      state: normState(r.state),
      lat: parseFloat(r.lat), lon: parseFloat(r.lon),
      image: String(r.image || '').trim(),
      layers: {}, status: {}
    };
    LKEYS.forEach(k => { rec.layers[k] = analyse(r[k]); rec.status[k] = rec.layers[k].status; });
    rec.done = LKEYS.filter(k => rec.status[k] === 'complete').length;
    rec.search = (rec.name + ' ' + rec.state + ' ' + rec.type + ' ' + I.TYPES[rec.typeKey].native + ' ' + LKEYS.map(k => rec.layers[k].text.replace(/https?:\S+/g, '')).join(' ')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return rec;
  }).filter(r => isFinite(r.lat) && isFinite(r.lon) && r.name);
  const BY_ID = new Map(RECS.map(r => [r.id, r]));

  // records that share exact coordinates get fanned out in a small ring so all stay clickable
  const groups = {};
  RECS.forEach(r => { const k = r.lat.toFixed(4) + ',' + r.lon.toFixed(4); (groups[k] = groups[k] || []).push(r); });
  Object.values(groups).forEach(g => g.forEach((r, i) => {
    if (g.length === 1) { r.dlat = r.lat; r.dlon = r.lon; return; }
    const a = (i / g.length) * Math.PI * 2, rad = 0.0028;
    r.dlat = r.lat + Math.sin(a) * rad; r.dlon = r.lon + Math.cos(a) * rad / Math.cos(r.lat * Math.PI / 180);
  }));

  const STATE_COUNTS = {};
  RECS.forEach(r => { STATE_COUNTS[r.state] = (STATE_COUNTS[r.state] || 0) + 1; });

  /* -------------------------------------------------------------------
     Geography: India states + bounding boxes
     ------------------------------------------------------------------- */
  const GEO = JSON.parse(JSON.stringify(window.DM_GEO.states));
  const BBOX = {};
  GEO.features.forEach(f => {
    const name = normState(f.properties.name);
    f.properties.name = name;
    f.properties.count = STATE_COUNTS[name] || 0;
    f.properties.project = !!STATES[name];
    let b = [180, 90, -180, -90];
    const walk = c => { if (typeof c[0] === 'number') { b = [Math.min(b[0], c[0]), Math.min(b[1], c[1]), Math.max(b[2], c[0]), Math.max(b[3], c[1])]; } else c.forEach(walk); };
    walk(f.geometry.coordinates);
    BBOX[name] = b;
  });
  const INDIA_BOUNDS = [[68.1, 6.6], [97.4, 35.6]];

  const F = { q: '', types: new Set(), state: 'all' };
  function filtered() {
    const q = F.q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
    return RECS.filter(r => (!F.types.size || F.types.has(r.typeKey)) && (F.state === 'all' || r.state === F.state) && (!q || q.split(/\s+/).every(w => r.search.includes(w))));
  }
  function ordered(list) {
    return TYPE_ORDER.flatMap(t => list.filter(r => r.typeKey === t).sort((a, b) => a.name.localeCompare(b.name)));
  }

  /* -------------------------------------------------------------------
     Map styles
     ------------------------------------------------------------------- */
  const PAL = {
    pothi: { slab: '#e7d7b1', ex1: '#e2b04a', ex2: '#c9752c', ex3: '#a4452c', hover: '#1f3364', tint: '#cf8106', line: '#7a5a3f', glow: '#c9a04a', border: '#6b3f22', active: '#a4452c', veil: '#efe3c4', veilOp: .55,
      sky: { 'sky-color': '#1a2d57', 'horizon-color': '#f1dfb4', 'fog-color': '#efe3c4' },
      hs: { 'hillshade-shadow-color': '#6e5034', 'hillshade-highlight-color': '#fff7e4', 'hillshade-accent-color': '#8c6a45', 'hillshade-exaggeration': .5 } },
    raat: { slab: '#22315a', ex1: '#e2b04a', ex2: '#d08a2e', ex3: '#b5552f', hover: '#7fb2c4', tint: '#e2b04a', line: '#c9a04a', glow: '#e2b04a', border: '#e2b04a', active: '#e2b04a', veil: '#08101f', veilOp: .55,
      sky: { 'sky-color': '#03070f', 'horizon-color': '#2b4583', 'fog-color': '#121c33' },
      hs: { 'hillshade-shadow-color': '#03060e', 'hillshade-highlight-color': '#4d65a6', 'hillshade-accent-color': '#0b1426', 'hillshade-exaggeration': .55 } },
    akash: { slab: '#efe3c4', ex1: '#f0c25c', ex2: '#d9822f', ex3: '#b04a2c', hover: '#ffffff', tint: '#f0c25c', line: '#f7ead0', glow: '#f0c25c', border: '#ffe3a1', active: '#f0c25c', veil: '#06101f', veilOp: .45,
      sky: { 'sky-color': '#0b1d3a', 'horizon-color': '#a9cbe8', 'fog-color': '#c4d8e8' },
      hs: null }
  };
  const DEM_TILES = ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'];
  const DEM = { type: 'raster-dem', tiles: DEM_TILES, encoding: 'terrarium', tileSize: 256, maxzoom: 15, attribution: 'Terrain: <a href="https://registry.opendata.aws/terrain-tiles/">Mapzen / AWS Terrain Tiles</a>' };

  const LOCAL = !!window.DM_LOCAL;
  let theme = store.get('dm-theme', document.documentElement.dataset.ui === 'dark' ? 'raat' : 'pothi');
  if (!PAL[theme] || (LOCAL && theme === 'akash')) theme = 'pothi';
  let terrainOn = !LOCAL && store.get('dm-terrain', innerWidth <= 760 ? '0' : '1') === '1';
  let exag = parseFloat(store.get('dm-exag', '1.6')) || 1.6;

  function wbGeoJSON(list) {
    return { type: 'FeatureCollection', features: list.map(r => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [r.dlon, r.dlat] }, properties: { id: r.id, type: r.typeKey } })) };
  }

  function composeStyle(withTerrain = true) {
    const P = PAL[theme];
    let style;
    if (theme === 'akash') {
      const hd = devicePixelRatio > 1 ? '@2x' : '';
      style = {
        version: 8,
        glyphs: 'https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf',
        sources: {
          sat: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics' },
          labels: { type: 'raster', tiles: ['a', 'b', 'c', 'd'].map(s => `https://${s}.basemaps.cartocdn.com/rastertiles/dark_only_labels/{z}/{x}/{y}${hd}.png`), tileSize: 256, attribution: '© CARTO © OpenStreetMap contributors' }
        },
        layers: [
          { id: 'background', type: 'background', paint: { 'background-color': '#0d1a30' } },
          { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-saturation': -.08, 'raster-contrast': .06, 'raster-fade-duration': 200 } },
          { id: 'sat-labels', type: 'raster', source: 'labels', paint: { 'raster-opacity': .95 } }
        ]
      };
    } else if (LOCAL) {
      // self-contained base map (Natural Earth) for hosts that cannot reach tile servers
      const night = theme === 'raat';
      const sea = night ? '#0a1426' : '#b4cbc3', land = night ? '#16213c' : '#efe3c4', river = night ? '#3a6c9c' : '#6f9ea6';
      style = {
        version: 8,
        sources: {
          'ne-land': { type: 'geojson', data: window.DM_LOCAL.land, attribution: 'Base map: Natural Earth' },
          'ne-lakes': { type: 'geojson', data: window.DM_LOCAL.lakes },
          'ne-rivers': { type: 'geojson', data: window.DM_LOCAL.rivers }
        },
        layers: [
          { id: 'background', type: 'background', paint: { 'background-color': sea } },
          { id: 'ne-land', type: 'fill', source: 'ne-land', paint: { 'fill-color': land } },
          { id: 'ne-coast', type: 'line', source: 'ne-land', paint: { 'line-color': night ? '#2b4583' : '#8fb0b0', 'line-width': ['interpolate', ['linear'], ['zoom'], 2, .6, 8, 2.2], 'line-blur': 1 } },
          { id: 'waterway', type: 'line', source: 'ne-rivers', paint: { 'line-color': river, 'line-opacity': .85, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, ['-', 2.2, ['*', ['get', 'scalerank'], .2]], 9, ['-', 5, ['*', ['get', 'scalerank'], .3]]] } },
          { id: 'ne-lakes', type: 'fill', source: 'ne-lakes', paint: { 'fill-color': sea, 'fill-outline-color': river } }
        ]
      };
    } else {
      style = JSON.parse(JSON.stringify(window.DM_BASEMAPS[theme]));
    }

    style.sources['dm-states'] = { type: 'geojson', data: GEO, promoteId: 'name' };
    style.sources['dm-outline'] = { type: 'geojson', data: window.DM_GEO.outline, attribution: 'India boundaries: Survey of India depiction via india-maps-data' };
    style.sources['dm-wb'] = {
      type: 'geojson', data: wbGeoJSON(filtered()), cluster: true, clusterRadius: 46, clusterMaxZoom: 13,
      clusterProperties: Object.fromEntries(TYPE_ORDER.map(t => [t, ['+', ['case', ['==', ['get', 'type'], t], 1, 0]]]))
    };
    style.sources['dm-dem'] = DEM;
    style.sources['dm-dem-hs'] = Object.assign({}, DEM);

    const hover = ['boolean', ['feature-state', 'hover'], false];
    const exHeight = ['+', ['case', ['get', 'project'], ['+', 42000, ['*', ['get', 'count'], 4200]], 16000], ['case', hover, 26000, 0]];
    const overlays = [
      { id: 'dm-india-glow', type: 'line', source: 'dm-outline', paint: { 'line-color': P.glow, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 5, 6, 14, 10, 18], 'line-blur': ['interpolate', ['linear'], ['zoom'], 2, 5, 6, 12], 'line-opacity': .5 } },
      { id: 'dm-states-fill', type: 'fill', source: 'dm-states', paint: {
        'fill-color': ['case', ['get', 'project'], P.tint, P.slab],
        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 5, ['case', hover, .3, ['get', 'project'], .14, 0], 9, ['case', ['get', 'project'], .05, 0]] } },
      { id: 'dm-extrude', type: 'fill-extrusion', source: 'dm-states', maxzoom: 6.6, paint: {
        'fill-extrusion-color': ['case', hover, P.hover, ['get', 'project'], ['interpolate', ['linear'], ['get', 'count'], 1, P.ex1, 10, P.ex2, 24, P.ex3], P.slab],
        'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 3, exHeight, 5.4, ['*', exHeight, .25], 6.2, 0],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': ['interpolate', ['linear'], ['zoom'], 3, theme === 'akash' ? .78 : .9, 5.6, .55, 6.3, 0],
        'fill-extrusion-vertical-gradient': true } },
      { id: 'dm-veil', type: 'fill', source: 'dm-states', filter: ['==', ['get', 'name'], '__none__'], paint: { 'fill-color': P.veil, 'fill-opacity': P.veilOp } },
      { id: 'dm-states-line', type: 'line', source: 'dm-states', minzoom: 5, paint: { 'line-color': P.line, 'line-width': ['interpolate', ['linear'], ['zoom'], 5, .6, 9, 1.4], 'line-opacity': .75, 'line-dasharray': [4, 2.5] } },
      { id: 'dm-india-line', type: 'line', source: 'dm-outline', minzoom: 5, paint: { 'line-color': P.border, 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 1.4, 10, 2.6] } },
      { id: 'dm-active-glow', type: 'line', source: 'dm-states', filter: ['==', ['get', 'name'], '__none__'], paint: { 'line-color': P.active, 'line-width': 10, 'line-blur': 8, 'line-opacity': .55 } },
      { id: 'dm-active-line', type: 'line', source: 'dm-states', filter: ['==', ['get', 'name'], '__none__'], paint: { 'line-color': P.active, 'line-width': 2.6, 'line-dasharray': [0, 4, 3] } },
      { id: 'dm-wb-src', type: 'circle', source: 'dm-wb', paint: { 'circle-radius': 1, 'circle-opacity': 0, 'circle-stroke-opacity': 0 } }
    ];
    // drop overlays below the label block so place names stay readable
    let at = style.layers.findIndex(l => l.id === 'watername_ocean' || l.id === 'sat-labels');
    if (at < 0) at = style.layers.length;
    style.layers.splice(at, 0, ...overlays);
    if (P.hs) {
      let h = style.layers.findIndex(l => l.id === 'waterway');
      if (h < 0) h = 1;
      style.layers.splice(h, 0, { id: 'dm-hillshade', type: 'hillshade', source: 'dm-dem-hs', layout: { visibility: terrainOn ? 'visible' : 'none' }, paint: Object.assign({ 'hillshade-illumination-direction': 315 }, P.hs) });
    }
    style.projection = { type: 'globe' };
    style.sky = Object.assign({ 'sky-horizon-blend': .55, 'horizon-fog-blend': .6, 'fog-ground-blend': .75, 'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 8, 0] }, P.sky);
    if (terrainOn && withTerrain) style.terrain = { source: 'dm-dem', exaggeration: exag };
    return style;
  }

  /* -------------------------------------------------------------------
     Map
     ------------------------------------------------------------------- */
  document.documentElement.dataset.ui = theme === 'raat' ? 'dark' : 'light';
  const map = new maplibregl.Map({
    container: 'map', style: composeStyle(), center: [72, 16], zoom: 1.25, pitch: 0, bearing: 0,
    maxPitch: 78, attributionControl: false, minZoom: 1, maxZoom: 18.5, dragRotate: true, touchPitch: true
  });
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-right');
  window.__atlas = map; // handy for debugging in the console

  let styleReady = false;
  map.on('style.load', () => { styleReady = true; applyActive(); syncMarkers(true); });
  map.on('error', e => { if (e && e.error && !/Failed to fetch|NetworkError|AJAXError|404|403/i.test(String(e.error.message || e.error))) console.warn(e.error); });

  /* ---------- zoom classes ---------- */
  function zoomClass() {
    const z = map.getZoom(), b = document.body.classList;
    const far = z < 5.4 && !activeState;
    b.toggle('z-far', far); b.toggle('z-near', !far); b.toggle('z-mid', far && z >= 4.7);
    b.toggle('z-deep', z >= 6.8); b.toggle('z-close', z >= 11.5);
  }
  map.on('zoom', zoomClass);

  /* ---------- compass rose, pitch, coordinates ---------- */
  const roseEl = $('#roseSvg svg');
  function updateRose() {
    roseEl.style.transform = `rotate(${-map.getBearing()}deg)`;
    $('#pitchLbl').textContent = Math.round(map.getPitch()) + '° tilt';
    $('[data-act="tilt"]').setAttribute('aria-pressed', map.getPitch() > 8 ? 'true' : 'false');
  }
  map.on('rotate', updateRose); map.on('pitch', updateRose);
  $('#rose').addEventListener('click', () => map.easeTo({ bearing: 0, duration: 900 }));
  const fmt = (v, p, n) => Math.abs(v).toFixed(3) + '° ' + (v >= 0 ? p : n);
  map.on('mousemove', e => { $('#coords').textContent = fmt(e.lngLat.lat, 'N', 'S') + '  ·  ' + fmt(e.lngLat.lng, 'E', 'W'); });

  /* -------------------------------------------------------------------
     Filters (search, types, state)
     ------------------------------------------------------------------- */
  function refreshData() {
    const src = map.getSource && map.getSource('dm-wb');
    if (src) src.setData(wbGeoJSON(filtered()));
    renderList(); renderChips(); renderLegend();
    requestAnimationFrame(() => syncMarkers(true));
  }

  /* -------------------------------------------------------------------
     Markers: kalash state pins + clustered water medallions (HTML)
     ------------------------------------------------------------------- */
  const statePins = {};
  function buildStatePins() {
    Object.entries(STATES).forEach(([name, s], i) => {
      if (statePins[name]) return;
      const el = document.createElement('div');
      el.className = 'state-pin';
      el.style.setProperty('--d', (i * 0.12) + 's');
      el.innerHTML = `<span class="ripple"></span>${I.kalash()}<span class="count">${STATE_COUNTS[name] || 0}</span><span class="name">${esc(name)}<small>${s.native}</small></span>`;
      el.setAttribute('role', 'button'); el.tabIndex = 0;
      el.setAttribute('aria-label', `${name}: ${STATE_COUNTS[name] || 0} water bodies`);
      const go = e => { e.stopPropagation(); enterState(name); };
      el.addEventListener('click', go);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(e); });
      el.addEventListener('mouseenter', () => { setHover(name); el.parentElement && (el.style.zIndex = 5); });
      el.addEventListener('mouseleave', () => { setHover(null); el.style.zIndex = ''; });
      statePins[name] = new maplibregl.Marker({ element: el, anchor: 'bottom', offset: [0, -8] }).setLngLat(s.pin).addTo(map);
    });
  }

  const wbMarkers = new Map(); // id -> marker
  const clMarkers = new Map(); // cluster id -> marker
  let activeId = null;
  function makeWbMarker(r) {
    const T = I.TYPES[r.typeKey];
    const el = document.createElement('div');
    el.className = 'wb-marker';
    el.style.setProperty('--c', T.color);
    el.style.setProperty('--pd', ((+r.id % 7) * 0.43) + 's');
    el.innerHTML = `<span class="wb-pulse"></span>${I.typeMarker(r.typeKey, r.status)}<div class="wb-label">${esc(r.name)}<small>${T.name} · ${esc(r.state)}</small></div>`;
    el.setAttribute('role', 'button'); el.tabIndex = 0;
    el.setAttribute('aria-label', `${r.name}, ${T.name}, ${r.state}`);
    const go = e => { e.stopPropagation(); openRecord(r); };
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') go(e); });
    el.addEventListener('mouseenter', () => { el.style.zIndex = 8; });
    el.addEventListener('mouseleave', () => { el.style.zIndex = r.id === activeId ? 7 : ''; });
    if (r.id === activeId) { el.classList.add('active'); el.style.zIndex = 7; }
    return new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([r.dlon, r.dlat]);
  }
  function makeCluster(f) {
    const p = f.properties, n = p.point_count;
    let acc = 0;
    const stops = TYPE_ORDER.filter(t => p[t]).map(t => { const a = acc / n * 360; acc += p[t]; return `${I.TYPES[t].color} ${a}deg ${acc / n * 360}deg`; }).join(',');
    const size = Math.round(46 + Math.min(n, 30) * 1.1);
    const el = document.createElement('div');
    el.className = 'cl-marker';
    el.style.cssText = `--s:${size}px;--ring:conic-gradient(${stops})`;
    el.innerHTML = `<span class="cl-ring"></span><span class="cl-core"><b>${n}</b><small>${n === 1 ? 'site' : 'sites'}</small></span>`;
    el.title = TYPE_ORDER.filter(t => p[t]).map(t => `${p[t]} ${p[t] > 1 ? I.TYPES[t].plural : I.TYPES[t].name}`.toLowerCase()).join(' · ') + ' — click to open';
    el.addEventListener('click', e => {
      e.stopPropagation();
      const src = map.getSource('dm-wb');
      const done = z => map.easeTo({ center: f.geometry.coordinates, zoom: Math.min((z || map.getZoom() + 2) + .3, 15), pitch: Math.max(map.getPitch(), 50), duration: 1100 });
      try { const pr = src.getClusterExpansionZoom(p.cluster_id, (err, z) => done(z)); if (pr && pr.then) pr.then(done, () => done()); } catch (err) { done(); }
    });
    return new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(f.geometry.coordinates);
  }
  let syncQueued = false;
  function syncMarkers(force) {
    if (!styleReady || !map.getSource('dm-wb')) return;
    if (syncQueued && !force) return;
    syncQueued = true;
    requestAnimationFrame(() => {
      syncQueued = false;
      if (map.getZoom() < 4.6 && !activeState) { // overview: state pins only
        wbMarkers.forEach(m => m.remove()); wbMarkers.clear();
        clMarkers.forEach(m => m.remove()); clMarkers.clear();
        return;
      }
      let feats;
      try { feats = map.querySourceFeatures('dm-wb'); } catch (e) { return; }
      const seenW = new Set(), seenC = new Set();
      feats.forEach(f => {
        const p = f.properties;
        if (p.cluster) {
          const key = String(p.cluster_id);
          if (seenC.has(key)) return; seenC.add(key);
          if (!clMarkers.has(key)) { const m = makeCluster(f); m.addTo(map); clMarkers.set(key, m); }
        } else {
          const id = String(p.id);
          if (seenW.has(id)) return; seenW.add(id);
          if (!wbMarkers.has(id) && BY_ID.has(id)) { const m = makeWbMarker(BY_ID.get(id)); m.addTo(map); wbMarkers.set(id, m); }
        }
      });
      wbMarkers.forEach((m, id) => { if (!seenW.has(id)) { m.remove(); wbMarkers.delete(id); } });
      clMarkers.forEach((m, id) => { if (!seenC.has(id)) { m.remove(); clMarkers.delete(id); } });
    });
  }
  map.on('render', () => syncMarkers());
  map.on('moveend', () => syncMarkers(true));
  map.on('idle', () => syncMarkers(true));
  map.on('sourcedata', e => { if (e.sourceId === 'dm-wb' && e.isSourceLoaded) syncMarkers(true); });
  function markActive(id) {
    const prev = activeId && wbMarkers.get(activeId);
    if (prev) { prev.getElement().classList.remove('active'); prev.getElement().style.zIndex = ''; }
    activeId = id;
    const cur = id && wbMarkers.get(id);
    if (cur) { cur.getElement().classList.add('active'); cur.getElement().style.zIndex = 7; }
    $$('.item').forEach(n => n.classList.toggle('active', n.dataset.id === id));
  }

  /* -------------------------------------------------------------------
     State hover & selection
     ------------------------------------------------------------------- */
  let hoverState = null, activeState = null;
  function setHover(name) {
    if (hoverState === name) return;
    if (hoverState && map.getSource('dm-states')) map.setFeatureState({ source: 'dm-states', id: hoverState }, { hover: false });
    hoverState = name;
    if (name && map.getSource('dm-states')) map.setFeatureState({ source: 'dm-states', id: name }, { hover: true });
    Object.entries(statePins).forEach(([n, m]) => m.getElement().classList.toggle('hot', n === name));
  }
  const hc = $('#hovercard');
  map.on('mousemove', e => {
    if (!styleReady) return;
    const z = map.getZoom();
    const layer = z < 6.2 ? 'dm-extrude' : null;
    const f = layer && map.getLayer(layer) ? map.queryRenderedFeatures(e.point, { layers: [layer] })[0] : null;
    if (!f) { setHover(null); hc.classList.remove('show'); map.getCanvas().style.cursor = ''; return; }
    const name = f.properties.name, proj = !!STATES[name];
    setHover(name);
    map.getCanvas().style.cursor = proj ? 'pointer' : '';
    hc.innerHTML = `<b>${esc(name)}</b>${proj ? `<span class="deva">${STATES[name].native}</span>` : ''}<div class="meta">${proj ? `${STATE_COUNTS[name]} water bodies documented · click to enter` : 'Not yet in this deep map'}</div>`;
    const x = Math.min(e.originalEvent.clientX + 16, innerWidth - 230), y = Math.min(e.originalEvent.clientY + 16, innerHeight - 90);
    hc.style.left = x + 'px'; hc.style.top = y + 'px';
    hc.classList.add('show');
  });
  map.getCanvas().addEventListener('mouseleave', () => { hc.classList.remove('show'); setHover(null); });
  map.on('click', e => {
    if (map.getZoom() >= 6.2 || !map.getLayer('dm-extrude')) return;
    const f = map.queryRenderedFeatures(e.point, { layers: ['dm-extrude'] })[0];
    if (f && STATES[f.properties.name]) enterState(f.properties.name);
  });

  function pad() {
    if (isMobile()) return { top: 120, bottom: $('#folio').classList.contains('open') ? innerHeight * .55 : 90, left: 30, right: 30 };
    return { top: 100, bottom: 70, left: $('#suchi').classList.contains('open') ? 470 : 110, right: $('#folio').classList.contains('open') ? 480 : 130 };
  }
  function applyActive() {
    if (!styleReady || !map.getLayer('dm-veil')) return;
    const n = activeState || '__none__';
    map.setFilter('dm-veil', activeState ? ['!=', ['get', 'name'], n] : ['==', ['get', 'name'], '__none__']);
    map.setFilter('dm-active-line', ['==', ['get', 'name'], n]);
    map.setFilter('dm-active-glow', ['==', ['get', 'name'], n]);
  }
  function setActiveState(name) {
    activeState = name;
    applyActive(); zoomClass(); syncMarkers(true);
    Object.entries(statePins).forEach(([n, m]) => m.getElement().classList.toggle('cur', n === name));
    const card = $('#stateCard');
    if (!name) { card.classList.remove('show'); return; }
    $('#scName').textContent = name;
    $('#scNative').textContent = STATES[name] ? STATES[name].native : '';
    const counts = TYPE_ORDER.map(t => [t, RECS.filter(r => r.state === name && r.typeKey === t).length]).filter(x => x[1]);
    $('#scCounts').innerHTML = counts.map(([t, n]) => `<span style="--c:${I.TYPES[t].color}" title="${n} ${I.TYPES[t].plural.toLowerCase()}">${I.typeIcon(t)}${n}</span>`).join('');
    card.classList.add('show');
  }
  function enterState(name, opts = {}) {
    stopTour();
    closeFolio(true);
    setActiveState(name);
    F.state = name; $('#stateSel').value = name;
    refreshData();
    if (!isMobile() && opts.list !== false) openSuchi();
    const b = BBOX[name];
    if (b) {
      const cam = { padding: pad(), pitch: 55, bearing: -14, duration: REDUCED ? 0 : 2800, maxZoom: 9.2, essential: true };
      map.fitBounds([[b[0], b[1]], [b[2], b[3]]], cam);
    }
    setURL({ state: name });
  }
  function exitState() {
    setActiveState(null);
    F.state = 'all'; $('#stateSel').value = 'all';
    closeFolio(true);
    refreshData();
    overview();
    setURL({});
  }
  function overview(duration = 2600) {
    const cam = map.cameraForBounds(INDIA_BOUNDS, { padding: isMobile() ? { top: 90, bottom: 80, left: 10, right: 10 } : { top: 70, bottom: 40, left: 220, right: 120 } });
    const z = cam ? cam.zoom - .05 : 4;
    map.flyTo({ center: [82.4, 21.6], zoom: z, pitch: 42, bearing: -8, duration: REDUCED ? 0 : duration, essential: true, curve: 1.4 });
  }
  $('#stateBack').addEventListener('click', exitState);

  /* -------------------------------------------------------------------
     Folio (details drawer)
     ------------------------------------------------------------------- */
  let cur = null, curLayer = null;
  const dms = (v, p, n) => { const t = Math.round(Math.abs(v) * 3600), d = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60; return `${d}°${String(m).padStart(2, '0')}′${String(s).padStart(2, '0')}″ ${v >= 0 ? p : n}`; };
  function navList() { const l = ordered(filtered()); return l.some(r => r === cur) ? l : ordered(RECS); }

  // photo for a record: js/photos.js first, then the image column of data.js
  function photoOf(r) {
    const p = (window.DM_PHOTOS || {})[r.id];
    if (p && p.src) return p;
    const ok = r.image && !/placeholder/i.test(r.image) && !/to be updated/i.test(r.image);
    return ok ? { src: r.image } : null;
  }
  function setHero(r) {
    const hero = $('#fHero'), T = I.TYPES[r.typeKey];
    const badge = `<span class="badge" style="--c:${T.color}">${I.typeIcon(r.typeKey)}${T.name}</span>`;
    const drawn = () => I.hero(r.typeKey, +r.id || 1, theme === 'raat') + badge + '<span class="ph-note">Illustration · photograph to come</span>';
    const p = photoOf(r);
    if (!p) { hero.innerHTML = drawn(); return; }
    hero.innerHTML = `<img src="${esc(p.src)}" alt="${esc(r.name)}, ${esc(r.state)}" decoding="async"${p.pos ? ` style="object-position:${esc(p.pos)}"` : ''}>${badge}${p.note ? `<span class="ph-note">${esc(p.note)}</span>` : ''}`;
    hero.querySelector('img').addEventListener('error', () => { hero.innerHTML = drawn(); }, { once: true });
  }

  function openRecord(r, opts = {}) {
    if (!r) return;
    if (opts.fromTour !== true) stopTour();
    cur = r;
    const T = I.TYPES[r.typeKey];
    const folio = $('#folio');
    folio.style.setProperty('--c', T.color);
    setHero(r);
    $('#fEyebrow').innerHTML = `${T.name} · <span class="deva">${T.native}</span>`;
    $('#fTitle').textContent = r.name;
    const sn = STATES[r.state] ? `<span class="deva">${STATES[r.state].native}</span>` : '';
    $('#fGeo').innerHTML = `<span>${I.ui('pin')}${esc(r.state)} ${sn}</span><span>${dms(r.lat, 'N', 'S')} · ${dms(r.lon, 'E', 'W')}</span>`;
    $('#fComplete').innerHTML = `<span>${r.done} of 4 layers written</span><span class="bar">${LKEYS.map(k => `<i class="${r.status[k]}" style="--c:${I.LAYERS[k].color}"></i>`).join('')}</span>`;
    $('#fTabs').innerHTML = LKEYS.map((k, i) => {
      const L = I.LAYERS[k];
      return `<button class="ltab ${r.status[k]}" role="tab" data-k="${k}" aria-selected="false" style="--c:${L.color}" title="${L.name} layer, narrated by the ${I.FISH_NAME[k].sp} (${i + 1})">
        <span class="st"></span>${I.fishBadge(k)}<span>${L.name}</span><small>${L.native}</small></button>`;
    }).join('');
    $$('#fTabs .ltab').forEach(b => b.addEventListener('click', () => showLayer(b.dataset.k)));
    showLayer(curLayer, true);
    const list = navList(), idx = list.indexOf(r);
    $('#fPos').textContent = `${idx + 1} / ${list.length}`;
    $('#folioScroll').scrollTop = 0;
    folio.classList.add('open'); folio.setAttribute('aria-hidden', 'false'); document.body.classList.add('folio-open');
    if (isMobile()) closeSuchi();
    if (r.state !== activeState && STATES[r.state]) setActiveState(r.state);
    markActive(r.id);
    if (opts.fly !== false) flyTo(r, opts);
    sound(r.typeKey);
    setURL({ wb: r.id });
  }
  function flyTo(r, opts = {}) {
    const z = { lake: 12.6, pond: 15, tank: 15.4, canal: 12.4, channel: 12, dam: 13 }[r.typeKey] || 13;
    map.flyTo({ center: [r.dlon, r.dlat], zoom: opts.zoom || z, pitch: opts.pitch || 60, bearing: opts.bearing != null ? opts.bearing : map.getBearing() + 18, padding: pad(), duration: REDUCED ? 0 : (opts.duration || 3200), curve: 1.5, essential: true });
  }
  function showLayer(k, silent) {
    curLayer = k;
    const r = cur, panel = $('#fPanel');
    $$('#fTabs .ltab').forEach(b => b.setAttribute('aria-selected', b.dataset.k === k ? 'true' : 'false'));
    if (!k) {
      panel.style.setProperty('--c', 'var(--gold)');
      panel.innerHTML = `<div class="intro-panel"><h3>Four layers of memory <span class="deva">चार परतें</span></h3>
        <p>Each water body is read through four lenses, and a different fish tells each one. Choose a fish to open its layer.</p>
        <div class="lyr">${LKEYS.map(x => { const L = I.LAYERS[x]; const s = r.status[x]; return `<button data-k="${x}" style="--c:${L.color}">${I.fishBadge(x)}<span><b>${L.name}</b><em>${I.FISH_NAME[x].sp}</em>${s === 'complete' ? 'Written' : s === 'sources' ? 'Sources gathered' : 'In research'}</span></button>`; }).join('')}</div></div>`;
      panel.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => showLayer(b.dataset.k)));
    } else {
      const L = I.LAYERS[k], d = r.layers[k];
      panel.style.setProperty('--c', L.color);
      let body;
      if (d.status === 'complete') {
        body = `<div class="body">${d.html}</div>`;
      } else {
        const rest = d.html.replace(/^\s*(to be updated|data coming soon\.?)\s*/i, '').replace(/^(\s*<br\s*\/?>\s*)+/i, '').replace(/^\s*<b>\s*Sources:\s*<\/b>\s*/i, '');
        body = `<div class="pending-note">${I.fishBadge(k)}<div><b>This layer is being researched</b>The ${L.name.toLowerCase()} narrative of ${esc(r.name)} will be written soon.${d.status === 'sources' ? ' The sources gathered so far are listed below.' : ''}</div></div>
          ${d.status === 'sources' ? `<div class="sources-h">Sources gathered</div><div class="body nodrop">${rest}</div>` : ''}`;
      }
      const F = I.FISH_NAME[k];
      panel.innerHTML = `<div class="narrator">${I.fish(k)}<div><span class="nr-eyebrow">Narrated by the ${F.sp} <span class="deva">${F.native}</span></span><h3>${L.name} <span class="deva">${L.native}</span></h3><span class="nr-persona">${F.persona}</span></div></div>${body}`;
      panel.querySelectorAll('a').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
    }
    if (!silent) { panel.classList.remove('turn'); void panel.offsetWidth; panel.classList.add('turn'); }
  }
  function closeFolio(keepState) {
    const f = $('#folio');
    if (!f.classList.contains('open')) return;
    f.classList.remove('open'); f.setAttribute('aria-hidden', 'true'); document.body.classList.remove('folio-open');
    curLayer = null; cur = null; markActive(null);
    if (!$('#tour').classList.contains('show')) sound('theme');
    if (!keepState) setURL(activeState ? { state: activeState } : {});
  }
  function step(d) {
    if (!cur) return;
    const l = navList(), i = l.indexOf(cur);
    openRecord(l[(i + d + l.length) % l.length]);
  }
  $('#fPrev').addEventListener('click', () => step(-1));
  $('#fNext').addEventListener('click', () => step(1));
  $('#fFly').addEventListener('click', () => cur && flyTo(cur, { bearing: map.getBearing() + 60 }));
  $('#fLink').addEventListener('click', () => {
    if (!cur) return;
    const url = (window.DM_SITE ? DM_SITE.originalURL() : location.href).split(/[?#]/)[0] + '?wb=' + encodeURIComponent(cur.id);
    const ok = () => toast('Link copied — share this water body');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, () => toast(url));
    else toast(url);
  });

  /* -------------------------------------------------------------------
     Jal Suchi (list), chips, legend
     ------------------------------------------------------------------- */
  const collapsed = new Set();
  function renderList() {
    const list = filtered(), box = $('#list');
    $('#countLbl').textContent = `${list.length} of ${RECS.length}`;
    if (!list.length) { box.innerHTML = `<div class="empty">${I.ui('help')}No water body matches.<br>Try another word or clear the filters.</div>`; return; }
    box.innerHTML = TYPE_ORDER.map(t => {
      const items = list.filter(r => r.typeKey === t).sort((a, b) => a.name.localeCompare(b.name));
      if (!items.length) return '';
      const T = I.TYPES[t];
      return `<div class="group ${collapsed.has(t) ? 'collapsed' : ''}" style="--c:${T.color}">
        <button class="group-h" data-t="${t}">${I.typeIcon(t)}${T.plural} <small>${T.native}</small><span class="n">${items.length}</span>${I.ui('chevron', 'chev')}</button>
        <div class="items">${items.map((r, i) => `<button class="item ${r.id === activeId ? 'active' : ''}" data-id="${r.id}" style="animation-delay:${Math.min(i, 12) * 25}ms">
          <span class="mini">${I.typeMarker(r.typeKey, r.status)}</span>
          <span class="t"><b>${esc(r.name)}</b><span>${esc(r.state)}</span></span>
          <span class="dots">${LKEYS.map(k => `<i class="dot ${r.status[k]}" style="--c:${I.LAYERS[k].color}" title="${I.LAYERS[k].name}: ${r.status[k]}"></i>`).join('')}</span>
        </button>`).join('')}</div></div>`;
    }).join('');
    box.querySelectorAll('.group-h').forEach(b => b.addEventListener('click', () => { const t = b.dataset.t; collapsed.has(t) ? collapsed.delete(t) : collapsed.add(t); b.parentElement.classList.toggle('collapsed'); }));
    box.querySelectorAll('.item').forEach(b => b.addEventListener('click', () => openRecord(BY_ID.get(b.dataset.id))));
  }
  const typeCounts = () => Object.fromEntries(TYPE_ORDER.map(t => [t, RECS.filter(r => r.typeKey === t).length]));
  function toggleType(t) { F.types.has(t) ? F.types.delete(t) : F.types.add(t); refreshData(); }
  function renderChips() {
    const c = typeCounts();
    $('#chips').innerHTML = TYPE_ORDER.filter(t => c[t]).map(t => `<button class="chip" style="--c:${I.TYPES[t].color}" data-t="${t}" aria-pressed="${F.types.has(t)}">${I.typeIcon(t)}${I.TYPES[t].plural}</button>`).join('');
    $$('#chips .chip').forEach(b => b.addEventListener('click', () => toggleType(b.dataset.t)));
  }
  function renderLegend() {
    const c = typeCounts();
    $('#lgTypes').innerHTML = TYPE_ORDER.map(t => `<button class="lg-type ${F.types.size && !F.types.has(t) ? 'off' : ''}" style="--c:${I.TYPES[t].color}" data-t="${t}" ${c[t] ? '' : 'disabled'} title="${c[t] ? 'Show only ' + I.TYPES[t].plural.toLowerCase() : 'None mapped yet'}">${I.typeIcon(t)}${I.TYPES[t].plural}<b>${c[t]}</b></button>`).join('');
    $$('#lgTypes .lg-type').forEach(b => b.addEventListener('click', () => toggleType(b.dataset.t)));
  }
  function initStateSelect() {
    const s = $('#stateSel');
    s.innerHTML = `<option value="all">All states · ${RECS.length}</option>` + Object.keys(STATES).filter(n => STATE_COUNTS[n]).sort().map(n => `<option value="${esc(n)}">${esc(n)} · ${STATE_COUNTS[n]}</option>`).join('');
    s.addEventListener('change', () => { s.value === 'all' ? exitState() : enterState(s.value, { list: true }); });
  }
  let qTimer;
  $('#q').addEventListener('input', e => { clearTimeout(qTimer); qTimer = setTimeout(() => { F.q = e.target.value; refreshData(); }, 120); });
  $('#lgToggle').addEventListener('click', () => $('#legend').classList.toggle('collapsed'));

  function openSuchi() { const s = $('#suchi'); s.classList.add('open'); document.body.classList.add('suchi-open'); s.setAttribute('aria-hidden', 'false'); $('[data-act="list"]').setAttribute('aria-pressed', 'true'); }
  function closeSuchi() { const s = $('#suchi'); s.classList.remove('open'); document.body.classList.remove('suchi-open'); s.setAttribute('aria-hidden', 'true'); $('[data-act="list"]').setAttribute('aria-pressed', 'false'); }

  /* -------------------------------------------------------------------
     Guided tour — a guided flight across the water bodies
     ------------------------------------------------------------------- */
  const TOUR = { list: [], i: 0, playing: false, timer: null, dwell: 9000 };
  function tourStops() {
    const order = ['Gujarat', 'Madhya Pradesh', 'Uttar Pradesh', 'Bihar', 'Jharkhand', 'West Bengal', 'Odisha', 'Tamil Nadu'];
    const seen = new Set();
    return filtered().filter(r => { const k = r.name.toLowerCase() + r.state; if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => (order.indexOf(a.state) - order.indexOf(b.state)) || (b.done - a.done) || (a.lon - b.lon));
  }
  function startTour() {
    TOUR.list = tourStops();
    if (!TOUR.list.length) { toast('No water bodies in the current filter'); return; }
    closeFolio(true); closeSuchi(); closeHelp();
    TOUR.i = 0; TOUR.playing = true;
    $('#tour').classList.add('show');
    $('[data-act="tour"]').setAttribute('aria-pressed', 'true');
    tourGo();
  }
  function tourGo() {
    clearTimeout(TOUR.timer);
    const r = TOUR.list[TOUR.i];
    if (!r) return stopTour();
    const T = I.TYPES[r.typeKey];
    $('#tourTitle').textContent = r.name;
    const tp = photoOf(r), ti = $('#tourImg');
    ti.hidden = true; ti.onerror = () => { ti.hidden = true; };
    if (tp) { ti.onload = () => { ti.hidden = false; }; ti.src = tp.src; ti.alt = r.name; if (tp.pos) ti.style.objectPosition = tp.pos; else ti.style.objectPosition = ''; }
    const nx = TOUR.list[(TOUR.i + 1) % TOUR.list.length], np = nx && photoOf(nx);
    if (np) { const pre = new Image(); pre.src = np.src; }
    $('#tourMeta').innerHTML = `${T.name} · ${esc(r.state)} · ${r.done}/4 layers written`;
    $('#tourPos').textContent = `${TOUR.i + 1} / ${TOUR.list.length}`;
    const k = ['historical', 'cultural', 'literary', 'environmental'].find(x => r.status[x] === 'complete');
    $('#tourText').innerHTML = k ? `<b style="color:${I.LAYERS[k].color}">${I.LAYERS[k].name} ·</b> ${esc(excerpt(r.layers[k].text))}` : 'Its layers are still being researched — sources have been gathered and the narratives will follow.';
    setActiveState(STATES[r.state] ? r.state : null);
    markActive(r.id);
    sound(r.typeKey);
    const bar = $('#tBar'); bar.className = ''; void bar.offsetWidth;
    const bearing = ((TOUR.i * 47) % 120) - 60;
    flyTo(r, { bearing, pitch: 64, duration: 4200 });
    map.once('moveend', () => {
      if (!TOUR.playing || TOUR.list[TOUR.i] !== r) return;
      bar.style.setProperty('--dur', TOUR.dwell + 'ms'); bar.className = 'run';
      if (!REDUCED) map.easeTo({ bearing: map.getBearing() + 28, duration: TOUR.dwell, easing: t => t, essential: true });
      TOUR.timer = setTimeout(() => { TOUR.i = (TOUR.i + 1) % TOUR.list.length; tourGo(); }, TOUR.dwell);
    });
    setPlayIcon();
  }
  function pauseTour() {
    if (!TOUR.playing) return;
    TOUR.playing = false; clearTimeout(TOUR.timer); map.stop();
    $('#tBar').classList.add('paused'); setPlayIcon();
  }
  function resumeTour() { TOUR.playing = true; tourGo(); }
  function stopTour() {
    if (!$('#tour').classList.contains('show')) return;
    TOUR.playing = false; clearTimeout(TOUR.timer);
    $('#tour').classList.remove('show');
    $('[data-act="tour"]').setAttribute('aria-pressed', 'false');
    if (!$('#folio').classList.contains('open')) sound('theme');
  }
  function setPlayIcon() { $('#tPlay').innerHTML = I.ui(TOUR.playing ? 'pause' : 'play'); }
  $('#tPlay').addEventListener('click', () => TOUR.playing ? pauseTour() : resumeTour());
  $('#tNext').addEventListener('click', () => { TOUR.i = (TOUR.i + 1) % TOUR.list.length; TOUR.playing = true; tourGo(); });
  $('#tPrev').addEventListener('click', () => { TOUR.i = (TOUR.i - 1 + TOUR.list.length) % TOUR.list.length; TOUR.playing = true; tourGo(); });
  $('#tStop').addEventListener('click', stopTour);
  $('#tOpen').addEventListener('click', () => { const r = TOUR.list[TOUR.i]; pauseTour(); openRecord(r, { fly: false, fromTour: true }); });
  ['mousedown', 'touchstart', 'wheel'].forEach(ev => map.getCanvasContainer().addEventListener(ev, () => { if (TOUR.playing) pauseTour(); }, { passive: true }));

  /* -------------------------------------------------------------------
     Rails, theme, help, keyboard
     ------------------------------------------------------------------- */
  function setTheme(t) {
    if (!PAL[t] || t === theme) return;
    theme = t; store.set('dm-theme', t);
    document.documentElement.dataset.ui = t === 'raat' ? 'dark' : 'light';
    styleReady = false;
    wbMarkers.forEach(m => m.remove()); wbMarkers.clear();
    clMarkers.forEach(m => m.remove()); clMarkers.clear();
    // MapLibre cannot swap a globe style while terrain is live, so lift terrain first and restore it after
    try { map.setTerrain(null); } catch (e) { /* no terrain yet */ }
    map.setStyle(composeStyle(false), { diff: false });
    map.once('style.load', () => { if (terrainOn) { try { map.setTerrain({ source: 'dm-dem', exaggeration: exag }); } catch (e) { console.warn(e); } } });
    $$('.theme-opt').forEach(b => b.setAttribute('aria-pressed', b.dataset.theme === t ? 'true' : 'false'));
    if (cur) setHero(cur);
  }
  function setTerrain(on) {
    terrainOn = on; store.set('dm-terrain', on ? '1' : '0');
    $('#terrainSwitch').setAttribute('aria-checked', String(on));
    $('[data-act="terrain"]').setAttribute('aria-pressed', String(on));
    if (!styleReady) return;
    try { map.setTerrain(on ? { source: 'dm-dem', exaggeration: exag } : null); } catch (e) { console.warn(e); }
    if (map.getLayer('dm-hillshade')) map.setLayoutProperty('dm-hillshade', 'visibility', on ? 'visible' : 'none');
  }
  $$('.theme-opt').forEach(b => { b.setAttribute('aria-pressed', b.dataset.theme === theme ? 'true' : 'false'); b.addEventListener('click', () => setTheme(b.dataset.theme)); });
  $('#terrainSwitch').addEventListener('click', () => setTerrain(!terrainOn));
  $('#exag').value = exag; $('#exagV').textContent = exag.toFixed(1) + '×';
  $('#exag').addEventListener('input', e => {
    exag = parseFloat(e.target.value); store.set('dm-exag', String(exag)); $('#exagV').textContent = exag.toFixed(1) + '×';
    if (terrainOn && styleReady) map.setTerrain({ source: 'dm-dem', exaggeration: exag });
  });
  setTerrain(terrainOn);
  window.addEventListener('dm:prefs', e => {
    if (e.detail.key !== 'ui') return;
    if (e.detail.ui === 'dark' && theme !== 'raat') setTheme('raat');
    else if (e.detail.ui === 'light' && theme === 'raat') setTheme('pothi');
    else document.documentElement.dataset.ui = theme === 'raat' ? 'dark' : 'light';
  });
  if (LOCAL) { // tile-free preview: hide controls that need online tiles
    ['[data-theme="akash"]', '[data-act="terrain"]', '.toggle-row', '.range-row'].forEach(q => $$(q).forEach(n => { n.hidden = true; }));
  }

  function togglePop(force) {
    const p = $('#themePop'), open = force != null ? force : !p.classList.contains('open');
    p.classList.toggle('open', open);
    $('[data-act="theme"]').setAttribute('aria-pressed', String(open));
  }
  function openHelp() { $('#help').classList.add('open'); }
  function closeHelp() { $('#help').classList.remove('open'); }
  $('#help').addEventListener('click', e => { if (e.target.id === 'help') closeHelp(); });
  $('#howto').innerHTML = [
    ['<div style="width:34px">' + I.kalash() + '</div>', 'Enter a state', 'Click a kalash pin or a raised state to fly into it.'],
    [I.typeMarker('tank', { historical: 'complete', cultural: 'complete', literary: 'sources', environmental: 'pending' }), 'Open a water body', 'Click a medallion; numbered clusters open as you zoom.'],
    [I.fishBadge('literary'), 'Read the four layers', 'Four fish narrators tell the historical, cultural, literary and environmental memory.'],
    [I.ui('tilt'), 'Tilt & rotate in 3D', 'Right-drag or Ctrl + drag; two fingers on touch screens.'],
    [I.ui('tour'), 'Take the guided tour', 'A guided flight from one water body to the next.'],
    [I.ui('list'), 'Search & filter', 'Find by name, state or water form in the Jal Suchi.']
  ].map(([ic, b, t]) => `<div><span class="ic">${ic}</span><span><b>${b}</b>${t}</span></div>`).join('');

  /* ---------- soundscapes ---------- */
  const SND = window.DM_SOUND;
  function sound(key) { if (SND) SND.scene(SND.SCENES[key] ? key : SND.sceneForType(key)); }
  if (SND) {
    SND.scene('theme');
    SND.onchange(st => {
      const b = $('[data-act="sound"]');
      b.querySelector('.snd-ico').innerHTML = I.ui(st.on ? 'sound' : 'mute');
      b.setAttribute('aria-pressed', String(st.playing));
      b.classList.toggle('await', st.on && !st.playing);
      b.setAttribute('aria-label', st.on ? 'Turn sound off' : 'Turn sound on');
      $('#soundTip').textContent = st.on ? (st.playing ? 'Sound on · ' + st.name : 'Sound on · tap anywhere to start') : 'Sound off';
      const chip = $('#npChip');
      chip.hidden = !st.playing;
      $('#npName').textContent = st.name;
    });
  } else { $('[data-act="sound"]').hidden = true; }

  const actions = {
    home: () => { location.href = 'index.html'; },
    india: () => { stopTour(); activeState ? exitState() : (closeFolio(), overview()); },
    list: () => $('#suchi').classList.contains('open') ? closeSuchi() : openSuchi(),
    tour: () => $('#tour').classList.contains('show') ? stopTour() : startTour(),
    lexicon: () => { let w = null; try { w = window.open('lexicon.html', '_blank'); } catch (e) { /* blocked */ } if (!w) location.href = 'lexicon.html'; },
    help: openHelp,
    menu: () => window.DM_SITE && DM_SITE.openMenu(),
    zin: () => map.zoomIn({ duration: 500 }),
    zout: () => map.zoomOut({ duration: 500 }),
    tilt: () => map.easeTo({ pitch: map.getPitch() > 8 ? 0 : 55, duration: 900 }),
    terrain: () => setTerrain(!terrainOn),
    theme: () => togglePop(),
    sound: () => { if (SND) { const on = SND.toggle(); toast(on ? 'Sound on — ' + SND.state().desc : 'Sound off'); } },
    full: () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); else document.exitFullscreen(); }
  };
  $$('[data-act]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); const a = actions[b.dataset.act]; a && a(); }));
  $$('[data-close]').forEach(b => b.addEventListener('click', () => {
    const w = b.dataset.close;
    if (w === 'folio') closeFolio(); else if (w === 'suchi') closeSuchi(); else if (w === 'help') closeHelp();
  }));
  document.addEventListener('click', e => { if (!e.target.closest('#themePop') && !e.target.closest('[data-act="theme"]')) togglePop(false); });

  document.addEventListener('keydown', e => {
    const typing = /input|select|textarea/i.test(e.target.tagName);
    if (e.key === 'Escape') {
      if ($('#help').classList.contains('open')) return closeHelp();
      if ($('#themePop').classList.contains('open')) return togglePop(false);
      if ($('#folio').classList.contains('open')) return closeFolio();
      if ($('#tour').classList.contains('show')) return stopTour();
      if ($('#suchi').classList.contains('open')) return closeSuchi();
      return;
    }
    if (typing) return;
    if (e.key === '/') { e.preventDefault(); openSuchi(); setTimeout(() => $('#q').focus(), 60); }
    if (cur && $('#folio').classList.contains('open')) {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (/^[1-4]$/.test(e.key)) showLayer(LKEYS[+e.key - 1]);
    }
  });

  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }

  function setURL(p) {
    const q = new URLSearchParams();
    if (p.wb) q.set('wb', p.wb); else if (p.state) q.set('state', p.state);
    new URLSearchParams(location.search).forEach((v, k) => { if (/^_x_tr_/.test(k)) q.set(k, v); }); // keep Google Translate's language
    const s = q.toString();
    try { history.replaceState(null, '', location.pathname + (s ? '?' + s : '')); } catch (e) { /* file:// or sandboxed */ }
  }

  /* ---------- animated "marching" border on the active state ---------- */
  const DASH = [[0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0], [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2], [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5]];
  let dashStep = 0, lastDash = 0;
  function animate(t) {
    if (activeState && styleReady && t - lastDash > 70 && map.getLayer('dm-active-line')) {
      lastDash = t; dashStep = (dashStep + 1) % DASH.length;
      try { map.setPaintProperty('dm-active-line', 'line-dasharray', DASH[dashStep]); } catch (e) { /* style switching */ }
    }
    requestAnimationFrame(animate);
  }
  if (!REDUCED) requestAnimationFrame(animate);

  /* -------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------- */
  initStateSelect();
  renderList(); renderChips(); renderLegend();
  zoomClass(); updateRose();

  const params = new URLSearchParams(location.search);
  let startState = params.get('state');
  const startWb = params.get('wb');
  if (!startState && !startWb && /state\.html$/i.test(document.referrer)) startState = store.get('selectedState', null);
  startState = startState ? normState(startState) : null;

  let booted = false;
  function boot() {
    if (booted) return; booted = true;
    $('#veil').classList.add('gone');
    const afterIntro = () => buildStatePins();
    if (startWb && BY_ID.has(startWb)) { buildStatePins(); openRecord(BY_ID.get(startWb), { duration: 5200 }); return; }
    if (startState && STATES[startState]) { buildStatePins(); enterState(startState); return; }
    if (params.get('tour')) { buildStatePins(); overview(REDUCED ? 0 : 2400); setTimeout(startTour, REDUCED ? 300 : 2600); return; }
    if (REDUCED) { overview(0); afterIntro(); return; }
    // cinematic arrival: a slow turn of the globe, then descent onto India
    map.easeTo({ center: [84, 18], zoom: 1.7, duration: 2200, easing: t => t * (2 - t) });
    map.once('moveend', () => { overview(5200); map.once('moveend', afterIntro); });
  }
  map.once('load', () => setTimeout(boot, 250));
  setTimeout(boot, 7000); // never leave the veil up if tiles are slow
})();
