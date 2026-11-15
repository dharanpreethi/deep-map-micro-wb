/* About page: live counts, fish-narrator layer cards, section tracking. */
(function () {
  'use strict';
  const I = window.DM_ICONS, R = window.DM_RECORDS || [], $ = s => document.querySelector(s);
  if (R.length) {
    const states = [...new Set(R.map(r => r.state))];
    $('#liveCount').innerHTML = `The map now holds <b>${R.length} water bodies</b> from <b>${states.length} states</b>: ${states.slice(0, -1).join(', ')} and ${states[states.length - 1]}. The team keeps adding more.`;
  }
  const L = {
    historical: ['aged and reflective', 'How the water body came to be and what it once meant: who built it, when, and what it witnessed.'],
    cultural: ['adorned like a Bengali wedding fish', 'How the water body lives on today as a place of ritual, worship and community life.'],
    literary: ['scholarly, with pothi and quill', 'Where it appears in fiction and non-fiction: literary works, travel writing and local storytelling.'],
    environmental: ['distressed in murky water', 'The ecological harm it faces now: pollution, siltation, encroachment and neglect.']
  };
  $('#layerGrid').innerHTML = Object.keys(L).map(k => {
    const M = I.LAYERS[k], n = R.filter(r => r.status[k] === 'complete').length;
    const F = I.FISH_NAME[k];
    return `<div class="card lg-card" style="--c:${M.color}">${I.fish(k)}<h3>${M.name} <span class="deva" style="font-size:1rem">${M.native}</span></h3><p>${L[k][1]}</p><div class="persona">Narrator: the ${F.sp} <span class="deva notranslate" style="text-transform:none">${F.native}</span> · ${L[k][0]}</div><p class="note" style="margin-top:.4rem">${n} of ${R.length} written</p></div>`;
  }).join('');
  // highlight the current section in the table of contents
  const links = [...document.querySelectorAll('.ab-glance a')];
  if ('IntersectionObserver' in window && links.length) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-30% 0px -60% 0px' });
    links.forEach(a => { const t = document.querySelector(a.getAttribute('href')); t && io.observe(t); });
  }
})();
