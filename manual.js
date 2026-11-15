/* User Manual: highlight the part of the manual you are reading. */
(function () {
  'use strict';
  const links = [...document.querySelectorAll('.man-toc a')];
  if (!('IntersectionObserver' in window) || !links.length) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => {
      const on = a.getAttribute('href') === '#' + e.target.id;
      a.classList.toggle('on', on);
      if (on && a.scrollIntoView) { const box = a.parentElement; box.scrollTo({ left: a.offsetLeft - box.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' }); }
    });
  }), { rootMargin: '-35% 0px -55% 0px' });
  links.forEach(a => { const t = document.querySelector(a.getAttribute('href')); t && io.observe(t); });
})();
