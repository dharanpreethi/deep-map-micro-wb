/* About page: live counts, fish-narrator layer cards, case studies, table-of-contents tracking. */
(function () {
  'use strict';
  const I = window.DM_ICONS, R = window.DM_RECORDS || [], $ = s => document.querySelector(s);
  if (R.length) {
    const states = [...new Set(R.map(r => r.state))];
    $('#liveCount').innerHTML = `The platform currently maps <b>${R.length} water bodies</b> across <b>${states.length} states</b> — ${states.join(', ')} — and grows as the team adds more.`;
  }
  const L = {
    historical: ['aged and reflective', 'The presence of the water body and its past significance: who built it, when, and what it witnessed.'],
    cultural: ['adorned like a Bengali wedding fish', 'How the water body works today as a site of ritual, religious practice and community life.'],
    literary: ['scholarly, with pothi and quill', 'References in fiction and non-fiction: literary works, travel narratives and local storytelling.'],
    environmental: ['distressed in murky water', 'The urgent ecological vulnerability of the site: pollution, siltation, encroachment and neglect.']
  };
  $('#layerGrid').innerHTML = Object.keys(L).map(k => {
    const M = I.LAYERS[k], n = R.filter(r => r.status[k] === 'complete').length;
    const F = I.FISH_NAME[k];
    return `<div class="card lg-card" style="--c:${M.color}">${I.fish(k)}<h3>${M.name} <span class="deva" style="font-size:1rem">${M.native}</span></h3><p>${L[k][1]}</p><div class="persona">Narrator: the ${F.sp} <span class="deva notranslate" style="text-transform:none">${F.native}</span> · ${L[k][0]}</div><p class="note" style="margin-top:.4rem">${n} of ${R.length} written</p></div>`;
  }).join('');
  const CASES = [
    { id: '20', title: 'Adi Ganga · West Bengal', text: 'The “original Ganga” flows past the Kalighat temple and lives on in the Manasamangal, Chandimangal and Raymangal, in folklore, patachitra and ritual bathing. The same channel is now reduced to a sewer, its dark grey-green water crossed by a metro line built despite years of protest.' },
    { id: '44', title: 'Damodar Kund · Gujarat', text: 'At the foot of Girnar, the kund is named for Krishna, praised in the Prabhas Khand of the Skanda Purana and linked to Narsinh Mehta’s prabhatiyas. Built under Chandraketpur, renovated under Skandagupta and rebuilt under the Junagadh Nawabs, it is now choked by the very pilgrim use that keeps it sacred.' },
    { id: '65', title: 'Kalingarayan Canal · Tamil Nadu', text: 'A 13th-century link between the Bhavani and Noyyal, said to follow the path of a snake, irrigating about 55,000 acres. Local songs and festivals revere its builder, while Tamil fiction such as Mukilini registers the textile effluents that now run through it.' }
  ];
  $('#aboutCases').innerHTML = CASES.map(c => {
    const r = R.find(x => x.id === c.id) || {};
    const img = r.photo ? `<img src="${r.photo}" alt="" loading="lazy" decoding="async">` : I.hero(r.type || 'canal', +c.id, false);
    return `<a class="card case lift" href="map.html?wb=${c.id}"><div class="ph">${img}</div><div class="bd"><h3>${c.title}</h3><p>${c.text}</p><span class="go">Open its four layers ${I.ui('next')}</span></div></a>`;
  }).join('');
  // highlight the current section in the table of contents
  const links = [...document.querySelectorAll('.toc a')];
  if ('IntersectionObserver' in window && links.length) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-30% 0px -60% 0px' });
    links.forEach(a => { const t = document.querySelector(a.getAttribute('href')); t && io.observe(t); });
  }
})();
