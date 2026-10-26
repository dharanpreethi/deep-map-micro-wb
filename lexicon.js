/* Lexicon of Indian water words. */
(function () {
    var I = window.DM_ICONS;
    
    /* ------------------------------------------------------------------
       LEXICON — edit or extend these entries.
       match: a regular expression tested against each water body's name
              and layer texts, or {type:'tank', state:'Tamil Nadu'}.
       ------------------------------------------------------------------ */
    var CATS = {
      form: { label: 'Water form', color: '#2c6a8a', icon: 'lake' },
      structure: { label: 'Structure', color: '#a4452c', icon: 'tank' },
      system: { label: 'System', color: '#a8740c', icon: 'canal' },
      culture: { label: 'Ritual & culture', color: '#cf8106', icon: 'pond' },
      concept: { label: 'Concept', color: '#2e3f7f', icon: 'channel' }
    };
    var LEXICON = [
      { term: 'Ahar–Pyne', native: 'आहर-पइन', lang: 'Magahi / Hindi · south Bihar', cat: 'system', def: 'An indigenous floodwater-harvesting system of south Bihar. Ahars are embanked catchment basins that hold monsoon run-off; pynes are channels that lead river water into them and on to the fields.' },
      { term: 'Anicut', native: 'அணைக்கட்டு', lang: 'Tamil, anaikattu', cat: 'structure', def: 'A masonry weir built across a river to raise its level and divert water into canals. The Kalingarayan canal of Erode begins at such an anicut on the Bhavani.', match: /kalingarayan|anicut|weir/i },
      { term: 'Baandh', native: 'बाँध', lang: 'Hindi · Bengali bãdh', cat: 'structure', def: 'A dam or embankment. The word covers both village earthen bunds and the great reservoirs of post-Independence river-valley projects.', match: /\bdam\b|embankment/i },
      { term: 'Baoli', native: 'बावड़ी', lang: 'Hindi / Urdu, also bawdi, bawali', cat: 'structure', def: 'A stepwell: a deep shaft or trench lined with descending flights of steps that lead to groundwater, often with pillared galleries where travellers rested in the cool. Built across north and west India from the medieval period.', match: /baoli|bawali|bawdi|stepwell/i },
      { term: 'Barrage', native: 'बराज', lang: 'English, in Indian use', cat: 'structure', def: 'A low, gated weir across a river that controls water level and diverts flow into canals, as at Farakka, Durgapur or Gokul.', match: /barrage/i },
      { term: 'Beel', native: 'বিল', lang: 'Bengali / Assamese', cat: 'form', def: 'A floodplain wetland or oxbow lake left behind by a wandering river, rich in fish and birds and fed each monsoon by floodwater.', match: /oxbow|floodplain wetland/i },
      { term: 'Blue humanities', native: 'नील मानविकी', lang: 'Scholarly field', cat: 'concept', def: 'Humanities scholarship that treats water — seas, rivers, wetlands, tanks — as a cultural, historical and ecological presence rather than a backdrop. This atlas is a blue humanities project.' },
      { term: 'Chhath', native: 'छठ', lang: 'Bhojpuri / Maithili / Hindi', cat: 'culture', def: 'A festival of thanksgiving to the Sun, observed at riverbanks, ponds and tanks across Bihar, Jharkhand and eastern Uttar Pradesh; devotees stand in water to offer arghya at sunset and sunrise.', match: /chhath/i },
      { term: 'Deep mapping', native: 'गहन मानचित्रण', lang: 'Method', cat: 'concept', def: 'A layered, many-voiced way of mapping place that gathers history, memory, story, ecology and everyday experience into one account. The term was popularised by William Least Heat-Moon’s PrairyErth (1991) and taken up across the spatial humanities.' },
      { term: 'Dighi', native: 'দিঘি', lang: 'Bengali', cat: 'form', def: 'A large rectangular tank, usually excavated by a ruler, zamindar or merchant as an act of public merit, with ghats on one or more sides.', match: /dighi/i },
      { term: 'Eri', native: 'ஏரி', lang: 'Tamil', cat: 'form', def: 'An irrigation tank of the Tamil country, typically formed by an earthen bund across a slope. Eris are often linked in cascades, the surplus of one feeding the next.', match: { state: 'Tamil Nadu', type: 'tank' } },
      { term: 'Ghat', native: 'घाट', lang: 'Pan-Indian', cat: 'culture', def: 'A flight of steps leading down to water, used for bathing, worship, washing and last rites; the threshold where everyday life meets the river or tank.', match: /\bghats?\b/i },
      { term: 'Jalashaya', native: 'जलाशय', lang: 'Sanskrit / Hindi', cat: 'form', def: 'Literally "abode of water": a reservoir or any large body of stored water.', match: /reservoir/i },
      { term: 'Jheel', native: 'झील', lang: 'Hindi / Urdu', cat: 'form', def: 'A lake, natural or embanked, generally larger and more permanent than a pond.', match: /jheel/i },
      { term: 'Khal', native: 'খাল', lang: 'Bengali', cat: 'form', def: 'A canal or tidal creek. Kolkata’s khals were dug or widened for drainage and boat traffic between the Hooghly and the eastern wetlands.', match: /beliaghata|bagjola|circular canal|tolly/i },
      { term: 'Kulam', native: 'குளம்', lang: 'Tamil', cat: 'form', def: 'A pond or tank, especially the stepped temple tank (koil kulam) used for ritual bathing and festival float processions.' },
      { term: 'Kund', native: 'कुंड', lang: 'Sanskrit / Hindi', cat: 'structure', def: 'A stepped tank or pool, frequently sacred, with steps on all sides converging on the water. Kunds hold rainwater or springs and are sites of ritual bathing.', match: /kund/i },
      { term: 'Micro water body', native: 'लघु जलाशय', lang: 'Working term of this project', cat: 'concept', def: 'A small water body — pond, tank, kund, minor canal or channel — that sustains local life yet is often missing from maps, policy and memory.' },
      { term: 'Nahar', native: 'नहर', lang: 'Hindi / Urdu', cat: 'system', def: 'A canal, usually for irrigation, drawing water from a river through a head-work and distributing it across fields.', match: { type: 'canal' } },
      { term: 'Nullah', native: 'नाला', lang: 'Hindi / Urdu, also nala', cat: 'form', def: 'A channel, drain or seasonal stream. In colonial cities many natural streams were straightened into nullahs for navigation and drainage.', match: /nullah|\bnala\b/i },
      { term: 'Ooruni', native: 'ஊருணி', lang: 'Tamil', cat: 'form', def: 'A village pond reserved for drinking water, protected from bathing and cattle, as distinct from tanks used for irrigation.' },
      { term: 'Pukur', native: 'পুকুর', lang: 'Bengali', cat: 'form', def: 'The household or village pond of Bengal, used for bathing, fish, washing and irrigation, and central to everyday life and literature.', match: { type: 'pond' } },
      { term: 'Ramsar site', native: 'रामसर स्थल', lang: 'International designation', cat: 'concept', def: 'A wetland of international importance listed under the Ramsar Convention on Wetlands (1971).', match: /ramsar/i },
      { term: 'Sagar', native: 'सागर', lang: 'Sanskrit / Hindi', cat: 'form', def: 'Literally "ocean"; the name proudly given to large man-made lakes and reservoirs.', match: /sagar/i },
      { term: 'Sarovar', native: 'सरोवर', lang: 'Sanskrit / Hindi', cat: 'form', def: 'A lake or large pond, often with sacred associations and lotus-filled waters.', match: /sarovar/i },
      { term: 'Tal', native: 'ताल', lang: 'Hindi / Bhojpuri, also taal', cat: 'form', def: 'A lake or shallow floodplain wetland, especially in the Gangetic plains of eastern Uttar Pradesh and Bihar.', match: /\btaa?l\b/i },
      { term: 'Talab', native: 'तालाब · તળાવ', lang: 'Hindi / Urdu · Gujarati talav', cat: 'form', def: 'A tank or pond, usually made by embanking a depression to catch monsoon run-off — the backbone of village water supply in much of India.', match: /talab|talav|talaab/i },
      { term: 'Tirtha', native: 'तीर्थ', lang: 'Sanskrit', cat: 'culture', def: 'Literally "a crossing place": a sacred site of pilgrimage, very often at a river, confluence, kund or tank.', match: /tirtha|pilgrimage/i },
      { term: 'Vav', native: 'વાવ', lang: 'Gujarati', cat: 'structure', def: 'The Gujarati word for a stepwell. Patan’s Rani ki Vav, near the Sahasralinga tank, is among the finest.', match: /\bvav\b|stepwell/i }
    ];

    // records from data.js, for the "in this atlas" links
    var rows = [];
    try { rows = Papa.parse(waterBodiesData, { header: true, skipEmptyLines: true }).data; } catch (e) { }
    var recs = rows.map(function (r) {
      var text = ['name', 'historical', 'cultural', 'literary', 'environmental'].map(function (k) { return String(r[k] || '').replace(/<[^>]+>/g, ' '); }).join(' ');
      return { id: String(r.id).trim(), name: String(r.name || '').trim(), state: String(r.state || '').trim(), type: String(r.type || '').trim().toLowerCase(), text: text };
    });
    function matches(e) {
      if (!e.match) return [];
      var seen = {}, out = [];
      recs.forEach(function (r) {
        var ok = e.match instanceof RegExp ? e.match.test(r.text) : ((!e.match.type || r.type === e.match.type) && (!e.match.state || r.state === e.match.state));
        var key = r.name.toLowerCase() + r.state;
        if (ok && !seen[key]) { seen[key] = 1; out.push(r); }
      });
      return out;
    }
    LEXICON.forEach(function (e) { e.hits = matches(e); e.hay = (e.term + ' ' + e.native + ' ' + e.lang + ' ' + e.def).toLowerCase(); });
    LEXICON.sort(function (a, b) { return a.term.localeCompare(b.term); });

    var state = { q: '', cat: 'all' };
    var catBox = document.getElementById('cats');
    catBox.innerHTML = '<button class="cat" data-c="all" aria-pressed="true">All</button>' + Object.keys(CATS).map(function (k) { return '<button class="cat" data-c="' + k + '" aria-pressed="false">' + CATS[k].label + '</button>'; }).join('');
    catBox.querySelectorAll('.cat').forEach(function (b) { b.addEventListener('click', function () { state.cat = b.dataset.c; catBox.querySelectorAll('.cat').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); render(); }); });
    document.getElementById('q').addEventListener('input', function (ev) { state.q = ev.target.value.toLowerCase().trim(); render(); });

    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
    function render() {
      var list = LEXICON.filter(function (e) { return (state.cat === 'all' || e.cat === state.cat) && (!state.q || e.hay.indexOf(state.q) > -1); });
      var letters = {};
      list.forEach(function (e) { letters[e.term[0].toUpperCase()] = 1; });
      document.getElementById('alpha').innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function (l) { return letters[l] ? '<a class="on" href="#L-' + l + '">' + l + '</a>' : '<a>' + l + '</a>'; }).join('');
      if (!list.length) { document.getElementById('grid').innerHTML = '<div class="none">No word matches — try another spelling.</div>'; return; }
      var last = '', html = '';
      list.forEach(function (e, i) {
        var C = CATS[e.cat], L = e.term[0].toUpperCase();
        var anchor = L !== last ? ' id="L-' + L + '"' : '';
        last = L;
        var seen = e.hits.length ? '<div class="seen">In this atlas: ' + e.hits.slice(0, 8).map(function (r) {
          var t = I.TYPES[r.type] ? r.type : 'lake';
          return '<a href="map.html?wb=' + encodeURIComponent(r.id) + '" style="--c:' + I.TYPES[t].color + '" title="' + esc(r.state) + '"><span style="color:' + I.TYPES[t].color + '">' + I.typeIcon(t) + '</span>' + esc(r.name) + '</a>';
        }).join('') + (e.hits.length > 8 ? '<span>+' + (e.hits.length - 8) + ' more</span>' : '') + '</div>' : '';
        html += '<article class="entry"' + anchor + ' style="--c:' + C.color + ';animation-delay:' + Math.min(i, 10) * 40 + 'ms">' +
          '<div class="head"><h2>' + esc(e.term) + '</h2><span class="native">' + e.native + '</span><span class="tag"><span>' + I.typeIcon(C.icon) + '</span>' + C.label + '</span></div>' +
          '<div class="lang">' + esc(e.lang) + '</div><p>' + esc(e.def) + '</p>' + seen + '</article>';
      });
      document.getElementById('grid').innerHTML = html;
    }
    render();
  })();
