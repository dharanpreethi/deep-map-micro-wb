/* Cite page: builds references in seven styles for the project or a single water body. */
(function () {
  'use strict';
  const R = window.DM_RECORDS || [], $ = s => document.querySelector(s), S = window.DM_SITE;
  const TITLE = 'Deep Mapping of Micro Water Bodies';
  const DEPT = 'Department of Humanities and Social Sciences, Indian Institute of Technology (Indian School of Mines) Dhanbad';
  const INST = 'Indian Institute of Technology (Indian School of Mines) Dhanbad';
  const YEAR = 2026;
  const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MLAMON = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  const here = window.DM_SITE && DM_SITE.PROXY ? DM_SITE.originalURL() : location.href;
  const base = /^https?:/.test(location.protocol) && !/claudeusercontent\.com|claude\.ai/.test(location.hostname) ? here.replace(/[^/]*([?#].*)?$/, '') : 'https://your-username.github.io/deep-mapping/';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const seen = new Set();
  const list = R.filter(r => { const k = r.name + r.state; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => a.name.localeCompare(b.name));
  $('#cWhat').innerHTML = `<option value="">The whole project</option><optgroup label="A single water body">${list.map(r => `<option value="${r.id}">${esc(r.name)} (${esc(r.state)})</option>`).join('')}</optgroup>`;
  const today = new Date(), localISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; $('#cDate').value = localISO(today);
  $('#cUrl').value = base;

  const STYLES = [
    { id: 'mla', name: 'MLA 9th' }, { id: 'apa', name: 'APA 7th' }, { id: 'chicago', name: 'Chicago 17th (notes–bibliography)' },
    { id: 'chicagoad', name: 'Chicago 17th (author–date)' }, { id: 'harvard', name: 'Harvard' }, { id: 'ieee', name: 'IEEE' },
    { id: 'bibtex', name: 'BibTeX', code: true }, { id: 'ris', name: 'RIS (Zotero, EndNote, Mendeley)', code: true }
  ];
  let cur = 'mla';
  $('#cTabs').innerHTML = STYLES.map(s => `<button role="tab" data-s="${s.id}" aria-selected="${s.id === cur}">${s.name.replace(/ \(.*\)/, '')}</button>`).join('');

  function build() {
    const id = $('#cWhat').value, r = id ? R.find(x => x.id === id) : null;
    const d = new Date(($('#cDate').value || localISO(today)) + 'T12:00:00');
    let url = ($('#cUrl').value || base).trim();
    if (r) url = url.replace(/(index\.html)?$/, '') + 'map.html?wb=' + r.id; else url = url.replace(/index\.html$/, '');
    const D = { day: d.getDate(), m: d.getMonth(), y: d.getFullYear() };
    const iso = `${D.y}-${String(D.m + 1).padStart(2, '0')}-${String(D.day).padStart(2, '0')}`;
    const e = r ? r.name : '';
    const out = {
      mla: r ? `“${e}.” <i>${TITLE}</i>, by T. Shanmugapriya et al., ${DEPT}, ${YEAR}, ${url}. Accessed ${D.day} ${MLAMON[D.m]} ${D.y}.`
        : `Shanmugapriya, T., et al. <i>${TITLE}</i>. ${DEPT}, ${YEAR}, ${url}. Accessed ${D.day} ${MLAMON[D.m]} ${D.y}.`,
      apa: r ? `Shanmugapriya, T., Bhimjyani, S., Nandi, S., &amp; Kumar, A. (${YEAR}). ${e}. In <i>Deep mapping of micro water bodies</i> [Interactive deep map]. ${DEPT}. Retrieved ${MON[D.m]} ${D.day}, ${D.y}, from ${url}`
        : `Shanmugapriya, T., Bhimjyani, S., Nandi, S., &amp; Kumar, A. (${YEAR}). <i>Deep mapping of micro water bodies</i> [Interactive deep map]. ${DEPT}. ${url}`,
      chicago: r ? `Shanmugapriya, T., Simran Bhimjyani, Simanta Nandi, and Aditya Kumar. “${e}.” In <i>${TITLE}</i>. Dhanbad: ${DEPT}, ${YEAR}. Accessed ${MON[D.m]} ${D.day}, ${D.y}. ${url}.`
        : `Shanmugapriya, T., Simran Bhimjyani, Simanta Nandi, and Aditya Kumar. <i>${TITLE}</i>. Dhanbad: ${DEPT}, ${YEAR}. Accessed ${MON[D.m]} ${D.day}, ${D.y}. ${url}.`,
      chicagoad: `Shanmugapriya, T., Simran Bhimjyani, Simanta Nandi, and Aditya Kumar. ${YEAR}. ${r ? `“${e}.” In ` : ''}<i>${TITLE}</i>. Dhanbad: ${DEPT}. Accessed ${MON[D.m]} ${D.day}, ${D.y}. ${url}.`,
      harvard: `Shanmugapriya, T., Bhimjyani, S., Nandi, S. and Kumar, A. (${YEAR}) ${r ? `‘${e}’, in ` : ''}<i>${TITLE}</i>. Dhanbad: ${INST}. Available at: ${url} (Accessed: ${D.day} ${MON[D.m]} ${D.y}).`,
      ieee: `T. Shanmugapriya, S. Bhimjyani, S. Nandi, and A. Kumar, “${r ? e + ',' : TITLE + ','}” ${r ? `in <i>${TITLE}</i>, ` : ''}Dept. of Humanities and Social Sciences, IIT (ISM) Dhanbad, ${YEAR}. [Online]. Available: ${url}. [Accessed: ${MLAMON[D.m].replace('.', '')}. ${D.day}, ${D.y}].`,
      bibtex: `@misc{dmimw${YEAR}${r ? r.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12) : ''},\n  author       = {Shanmugapriya, T. and Bhimjyani, Simran and Nandi, Simanta and Kumar, Aditya},\n  title        = {${r ? e + ' --- ' : ''}${TITLE}},\n  howpublished = {Interactive deep map},\n  organization = {${DEPT}},\n  year         = {${YEAR}},\n  url          = {${url}},\n  note         = {Accessed: ${iso}}\n}`,
      ris: `TY  - ${r ? 'ELEC' : 'WEB'}\nAU  - Shanmugapriya, T.\nAU  - Bhimjyani, Simran\nAU  - Nandi, Simanta\nAU  - Kumar, Aditya\nTI  - ${r ? e : TITLE}\n${r ? `T2  - ${TITLE}\n` : ''}PY  - ${YEAR}\nPB  - ${DEPT}\nCY  - Dhanbad\nUR  - ${url}\nY2  - ${iso.replace(/-/g, '/')}\nLA  - English\nER  - `
    };
    const S1 = STYLES.find(s => s.id === cur);
    $('#cFmt').textContent = S1.name;
    const box = $('#cText');
    box.classList.toggle('code', !!S1.code);
    if (S1.code) box.textContent = out[cur]; else box.innerHTML = out[cur];
    const intext = { mla: '(Shanmugapriya et al.)', apa: `(Shanmugapriya et al., ${YEAR})`, chicagoad: `(Shanmugapriya et al. ${YEAR})`, harvard: `(Shanmugapriya et al., ${YEAR})`, ieee: '[1]' }[cur];
    $('#cInText').innerHTML = intext ? `In-text citation: <b>${intext}</b>` : 'Import this text into your reference manager.';
  }
  $('#cTabs').addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b) return; cur = b.dataset.s; document.querySelectorAll('#cTabs button').forEach(x => x.setAttribute('aria-selected', String(x === b))); build(); });
  ['cWhat', 'cDate', 'cUrl'].forEach(id => $('#' + id).addEventListener('input', build));
  $('#cCopy').addEventListener('click', e => S.copyText($('#cText').innerText, e.currentTarget));
  $('#cCopyRich').addEventListener('click', e => {
    const btn = e.currentTarget, html = $('#cText').innerHTML, text = $('#cText').innerText;
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
      navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) })]).then(() => S.toast('Copied with formatting'), () => S.copyText(text, btn));
    } else S.copyText(text, btn);
  });
  const p = new URLSearchParams(location.search).get('wb'); if (p && R.some(r => r.id === p)) $('#cWhat').value = p;
  build();
})();
