/* Reading preferences, applied before the page paints (text size, theme, contrast, motion, font, links). */
(function (d) {
  var g = function (k, v) { try { var x = localStorage.getItem(k); return x == null ? v : x; } catch (e) { return v; } };
  var r = d.documentElement, ui = g('dm-ui', 'auto');
  if (ui === 'auto') ui = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  r.setAttribute('data-ui', ui);
  r.setAttribute('data-fs', g('dm-fs', '1'));
  ['contrast', 'motion', 'font', 'links'].forEach(function (k) { if (g('dm-' + k, '0') === '1') r.setAttribute('data-' + k, '1'); });
})(document);
