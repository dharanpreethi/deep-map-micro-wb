/* FAQ: search and expand-all. */
(function () {
  const items = [...document.querySelectorAll('#faq details')], none = document.getElementById('faqNone'), all = document.getElementById('faqAll');
  document.getElementById('fq').addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim(); let n = 0;
    items.forEach(d => { const hit = !q || d.textContent.toLowerCase().includes(q); d.hidden = !hit; if (hit) n++; if (q && hit) d.open = true; });
    none.hidden = n > 0;
  });
  all.addEventListener('click', () => { const open = all.getAttribute('aria-pressed') !== 'true'; items.forEach(d => { d.open = open; }); all.setAttribute('aria-pressed', String(open)); all.textContent = open ? 'Collapse all' : 'Expand all'; });
  if (location.hash) { const d = document.querySelector(location.hash); if (d && d.tagName === 'DETAILS') d.open = true; }
})();
