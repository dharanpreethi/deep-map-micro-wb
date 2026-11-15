/* =====================================================================
   Deep Mapping of Micro Water Bodies — shared site shell
   Header + navigation, footer, welcome pop-up, reading & accessibility
   panel, Google Translate language menu, sound switch, scroll reveals.
   One file, used by every page (the 3D map uses the panels only).
   ===================================================================== */
(function () {
  'use strict';
  const I = window.DM_ICONS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const body = document.body;
  const PAGE = body.dataset.page || '';
  const ATLAS = body.classList.contains('atlas');
  const REDUCED = () => root.dataset.motion === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  const EMAIL = 'shanmugapriya@iitism.ac.in';
  const TEAM = [
    { id: 'shanmugapriya', name: 'Shanmugapriya T.', role: 'Lead Researcher | Conceptualisation and Content', short: 'Assistant Professor (Digital Humanities)', photo: 'shanmugapriya.webp', url: 'https://shanmugapriya.com/', layer: 'literary' },
    { id: 'simran', name: 'Simran Bhimjyani', role: 'Lead Researcher | Conceptualisation and Content', short: 'Doctoral Scholar, Digital Environmental Humanities', photo: 'simran.webp', url: 'https://simran174-iitism.github.io/simranbhimjyani.in/', layer: 'environmental' },
    { id: 'simanta', name: 'Simanta Nandi', role: 'Website Design & Development', short: 'MA, Digital Humanities and Social Sciences', photo: 'simanta.webp', url: 'https://about.me/simantanandi', layer: 'cultural' },
    { id: 'aditya', name: 'Aditya Kumar', role: 'Website Design & Development', short: 'MA, Digital Humanities and Social Sciences', photo: 'aditya.webp', url: 'https://www.linkedin.com/in/aditya-kumar-singh1999/', layer: 'historical' }
  ];
  root.classList.add('js');

  /* ---------------- navigation map ---------------- */
  const NAV = [
    { id: 'home', label: 'Home', href: 'index.html' },
    { id: 'project', label: 'Project & About', children: [
      { id: 'about', label: 'About the Project', href: 'about.html', icon: 'info', desc: 'Brief, method, fish narrators and open tools' },
      { id: 'team', label: 'Our Team', href: 'team.html', icon: 'team', desc: 'The four researchers behind the map' }
    ] },
    { id: 'explore', label: 'Explore', children: [
      { id: 'collection', label: 'Jal Yatra', href: 'explore.html', icon: 'tour', desc: 'Journey through every water body by state, form and layer' },
      { id: 'lexicon', label: 'Lexicon', href: 'lexicon.html', icon: 'lexicon', desc: 'India’s vocabulary of water' },
      { id: 'manual', label: 'User Manual', href: 'user-manual.html', icon: 'book', desc: 'How to use the 3D map, step by step' }
    ] },
    { id: 'gov', label: 'Governance & Contact', children: [
      { id: 'licensing', label: 'Licensing & Credits', href: 'licensing.html', icon: 'cc', desc: 'CC BY-NC 4.0, sources and credits' },
      { id: 'faq', label: 'FAQ', href: 'faq.html', icon: 'question', desc: 'Fifteen common questions answered' },
      { id: 'cite', label: 'Cite This Project', href: 'cite.html', icon: 'cite', desc: 'MLA, APA, Chicago, Harvard, BibTeX…' },
      { id: 'contact', label: 'Contact', href: 'contact.html', icon: 'mail', desc: 'Write to the project team' }
    ] }
  ];
  const groupOf = id => (NAV.find(n => n.id === id || (n.children || []).some(c => c.id === id)) || {}).id;

  /* ---------------- languages (Google Translate) ---------------- */
  const LANGS = [
    { c: 'en', n: 'English', l: 'Original' },
    { c: 'hi', n: 'हिन्दी', l: 'Hindi' },
    { c: 'bn', n: 'বাংলা', l: 'Bengali' },
    { c: 'gu', n: 'ગુજરાતી', l: 'Gujarati' },
    { c: 'or', n: 'ଓଡ଼ିଆ', l: 'Odia' },
    { c: 'ta', n: 'தமிழ்', l: 'Tamil' },
    { c: 'bho', n: 'भोजपुरी', l: 'Bhojpuri · Bihar' },
    { c: 'mai', n: 'मैथिली', l: 'Maithili · Bihar' },
    { c: 'sat', n: 'ᱥᱟᱱᱛᱟᱲᱤ', l: 'Santali · Jharkhand' }
  ];
  /* Google retired its embeddable Website Translator widget on 1 October 2026, so the site uses
     Google Translate's full-page translation instead: choosing a language reopens the current page
     through translate.goog, where every link keeps the chosen language. It needs a public address,
     so it works on the published site (GitHub Pages) but not on a private preview or a local file. */
  const PROXY = /\.translate\.goog$/i.test(location.hostname);
  const qs = new URLSearchParams(location.search);
  const curLang = () => (PROXY && qs.get('_x_tr_tl')) || 'en';
  function originalURL() { // undo translate.goog's host encoding: "a-b.github.io" -> "a--b-github-io.translate.goog"
    if (!PROXY) return location.href;
    const host = location.hostname.replace(/\.translate\.goog$/i, '').replace(/--/g, '\u0000').replace(/-/g, '.').replace(/\u0000/g, '-');
    const p = new URLSearchParams(location.search); [...p.keys()].filter(k => /^_x_tr_/.test(k)).forEach(k => p.delete(k));
    const q = p.toString();
    return 'https://' + host + location.pathname + (q ? '?' + q : '') + location.hash;
  }
  function canTranslate() {
    if (PROXY) return true;
    if (!/^https?:$/.test(location.protocol)) return false;
    const h = location.hostname;
    if (/^(localhost|127\.|10\.|192\.168\.|\[?::1)/.test(h) || !h.includes('.')) return false;
    if (/(^|\.)claudeusercontent\.com$|(^|\.)claude\.ai$/.test(h)) return false; // private preview
    return true;
  }
  function translatedURL(code) {
    if (PROXY) { const p = new URLSearchParams(location.search); p.set('_x_tr_tl', code); p.set('_x_tr_sl', 'en'); p.set('_x_tr_hl', 'en'); return location.pathname + '?' + p.toString() + location.hash; }
    return 'https://translate.google.com/translate?sl=en&tl=' + encodeURIComponent(code) + '&hl=en&u=' + encodeURIComponent(location.href);
  }
  function setLang(code) {
    if (code === curLang()) return;
    if (code === 'en') { location.href = originalURL(); return; }
    if (!canTranslate()) {
      $$('.lang-warn').forEach(n => { n.hidden = false; n.classList.remove('flash'); void n.offsetWidth; n.classList.add('flash'); });
      if (!$('#langPop').classList.contains('open')) togglePop('langPop', $('[data-pop="langPop"]'));
      return;
    }
    const L = LANGS.find(l => l.c === code);
    toast('Opening this page in ' + (L ? L.l.split(' ·')[0] : code) + ' with Google Translate…');
    setTimeout(() => { location.href = translatedURL(code); }, 350);
  }
  function paintLang(code) {
    const L = LANGS.find(l => l.c === code) || LANGS[0];
    $$('[data-lang-current]').forEach(n => { n.textContent = L.c === 'en' ? 'EN' : L.n; });
    $$('.lang-opt').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.c === code)));
  }

  /* ---------------- reading & accessibility preferences ---------------- */
  const FS = [{ v: '0', l: 'A−', p: '90%' }, { v: '1', l: 'A', p: '100%' }, { v: '2', l: 'A+', p: '112%' }, { v: '3', l: 'A++', p: '125%' }, { v: '4', l: 'A+++', p: '140%' }];
  const prefs = {
    get ui() { return store.get('dm-ui', 'auto'); },
    set(k, v) {
      store.set('dm-' + k, v);
      if (k === 'ui') { const r = v === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : v; root.dataset.ui = r; }
      else if (k === 'fs') root.dataset.fs = v;
      else if (v === '1') root.setAttribute('data-' + k, '1'); else root.removeAttribute('data-' + k);
      if (k === 'font') loadReadableFont();
      paintA11y();
      window.dispatchEvent(new CustomEvent('dm:prefs', { detail: { key: k, value: v, ui: root.dataset.ui } }));
    },
    reset() { ['fs', 'ui', 'contrast', 'motion', 'font', 'links'].forEach(k => { try { localStorage.removeItem('dm-' + k); } catch (e) { /* */ } }); prefs.set('fs', '1'); prefs.set('ui', 'auto'); ['contrast', 'motion', 'font', 'links'].forEach(k => prefs.set(k, '0')); }
  };
  function loadReadableFont() {
    if (root.dataset.font !== '1' || $('#dm-readable-font')) return;
    const l = document.createElement('link'); l.id = 'dm-readable-font'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap';
    document.head.appendChild(l);
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener && matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (prefs.ui === 'auto') prefs.set('ui', 'auto'); });

  function a11yHTML() {
    const tog = (k, icon, label, hint) => `<div class="a11y-row"><span class="a11y-ic">${I.ui(icon)}</span><span class="a11y-l"><b>${label}</b><small>${hint}</small></span><button class="switch" role="switch" data-pref="${k}" aria-checked="false" aria-label="${label}"></button></div>`;
    return `<div class="pop-h">${I.ui('a11y')}<b>Reading &amp; accessibility</b></div>
      <div class="a11y-block"><div class="a11y-cap">${I.ui('textsize')}Text size <span id="fsPct">100%</span></div>
        <div class="seg" role="group" aria-label="Text size">${FS.map(f => `<button data-fs="${f.v}" aria-label="Text size ${f.p}">${f.l}</button>`).join('')}</div></div>
      <div class="a11y-block"><div class="a11y-cap">${I.ui('moon')}Appearance</div>
        <div class="seg" role="group" aria-label="Appearance"><button data-ui="light">${I.ui('sun')}Light</button><button data-ui="dark">${I.ui('moon')}Dark</button><button data-ui="auto">${I.ui('contrast')}Auto</button></div></div>
      ${tog('contrast', 'contrast', 'High contrast', 'Stronger text and borders')}
      ${tog('motion', 'motion', 'Reduce motion', 'Stop animations and flights')}
      ${tog('font', 'font', 'Readable font', 'Atkinson Hyperlegible for all text')}
      ${tog('links', 'underline', 'Underline links', 'Make every link stand out')}
      <button class="a11y-reset" data-reset>${I.ui('reset')}Reset to defaults</button>`;
  }
  function paintA11y() {
    $$('[data-fs]').forEach(b => { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(b.dataset.fs === (root.dataset.fs || '1'))); });
    const f = FS.find(x => x.v === (root.dataset.fs || '1')); $$('#fsPct').forEach(n => { n.textContent = f ? f.p : '100%'; });
    $$('button[data-ui]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ui === prefs.ui)));
    $$('[data-pref]').forEach(b => b.setAttribute('aria-checked', String(root.getAttribute('data-' + b.dataset.pref) === '1')));
  }
  function wirePanel(p) {
    p.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.fs) prefs.set('fs', b.dataset.fs);
      else if (b.dataset.ui) prefs.set('ui', b.dataset.ui);
      else if (b.dataset.pref) prefs.set(b.dataset.pref, b.getAttribute('aria-checked') === 'true' ? '0' : '1');
      else if (b.hasAttribute('data-reset')) prefs.reset();
      else if (b.classList.contains('lang-opt')) { if (canTranslate()) closePops(); setLang(b.dataset.c); }
    });
  }
  const langHTML = () => `<div class="pop-h">${I.ui('lang')}<b>Read this site in</b></div>
    <p class="pop-note lang-warn" ${canTranslate() ? 'hidden' : ''}>${I.ui('info')}<span><b>Translation works on the published website.</b> Google Translate can only read public pages, and this copy is private or opened from your computer. Once the site is live on GitHub Pages, choosing a language opens it translated.</span></p>
    <div class="lang-grid">${LANGS.map(l => `<button class="lang-opt notranslate" data-c="${l.c}" lang="${l.c}" aria-pressed="false"><b>${l.n}</b><small>${l.l}</small></button>`).join('')}</div>
    <p class="pop-note">Machine translation by Google Translate. The page reopens translated, and links you follow stay in your language. Names and scripts of water bodies stay in their original form.</p>`;

  /* ---------------- popovers ---------------- */
  function makePop(id, html) {
    const p = document.createElement('div');
    p.id = id; p.className = 'sitepop'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', id === 'a11yPop' ? 'Reading and accessibility' : 'Language');
    p.innerHTML = html; body.appendChild(p); wirePanel(p); return p;
  }
  let openPop = null, opener = null;
  function togglePop(id, btn) {
    const p = $('#' + id);
    if (openPop === p) return closePops();
    closePops();
    p.classList.add('open'); openPop = p; opener = btn || null;
    if (btn) {
      btn.setAttribute('aria-expanded', 'true');
      const r = btn.getBoundingClientRect(), w = p.offsetWidth;
      if (innerWidth > 640) { p.style.left = Math.max(12, Math.min(innerWidth - w - 12, r.right - w)) + 'px'; p.style.top = (r.bottom + 10) + 'px'; p.style.bottom = 'auto'; }
      else { p.style.left = ''; p.style.top = ''; p.style.bottom = ''; }
      if (ATLAS && innerWidth > 640) { p.style.left = (r.right + 12) + 'px'; p.style.top = Math.max(12, Math.min(innerHeight - p.offsetHeight - 12, r.top - 20)) + 'px'; }
    }
    const f = p.querySelector('button'); f && f.focus({ preventScroll: true });
  }
  function closePops() {
    if (openPop) openPop.classList.remove('open');
    if (opener) { opener.setAttribute('aria-expanded', 'false'); }
    openPop = null; opener = null;
  }
  document.addEventListener('click', e => { if (openPop && !e.target.closest('.sitepop') && !e.target.closest('[data-pop]')) closePops(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && openPop) { const o = opener; closePops(); o && o.focus(); } });

  /* ---------------- toast ---------------- */
  let toastT;
  function toast(msg) {
    let t = $('#siteToast');
    if (!t) { t = document.createElement('div'); t.id = 'siteToast'; t.className = 'site-toast'; t.setAttribute('role', 'status'); body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* ---------------- header ---------------- */
  function headerHTML() {
    const g = groupOf(PAGE);
    const items = NAV.map(n => {
      if (!n.children) return `<li><a class="nav-a ${PAGE === n.id ? 'cur' : ''}" href="${n.href}" ${PAGE === n.id ? 'aria-current="page"' : ''}>${n.label}</a></li>`;
      return `<li class="has-dd ${g === n.id ? 'cur-group' : ''}"><button class="nav-a" aria-expanded="false" aria-haspopup="true">${n.label}${I.ui('chevron', 'chev')}</button>
        <div class="dd" role="menu">${n.children.map(c => `<a role="menuitem" href="${c.href}" class="${PAGE === c.id ? 'cur' : ''}" ${PAGE === c.id ? 'aria-current="page"' : ''}><span class="dd-ic">${I.ui(c.icon)}</span><span><b>${c.label}</b><small>${c.desc}</small></span></a>`).join('')}</div></li>`;
    }).join('');
    return `<a class="skip" href="#main">Skip to content</a>
      <div class="bar">
        <a class="brand notranslate" href="index.html" aria-label="Deep Mapping of Micro Water Bodies — home">${I.logo()}<span><small>Deep Mapping of</small><b>Micro Water Bodies</b></span></a>
        <nav class="mainnav" aria-label="Main"><ul>${items}</ul></nav>
        <div class="tools">
          <button class="tbtn lang-btn" data-pop="langPop" aria-expanded="false" aria-label="Choose language">${I.ui('lang')}<span data-lang-current class="notranslate">EN</span></button>
          <button class="tbtn" data-pop="a11yPop" aria-expanded="false" aria-label="Reading and accessibility options">${I.ui('a11y')}</button>
          <button class="tbtn snd-btn" data-sound aria-label="Sound" title="Sound">${I.ui('sound')}<span class="eq"><i></i><i></i><i></i></span></button>
          <button class="tbtn menu-btn" data-menu aria-expanded="false" aria-controls="navDrawer" aria-label="Open menu">${I.ui('menu')}</button>
        </div>
      </div>
      <div class="drawer-nav" id="navDrawer" hidden>
        <nav aria-label="Main (mobile)">${NAV.map(n => n.children
          ? `<div class="dn-group"><div class="dn-h">${n.label}</div>${n.children.map(c => `<a href="${c.href}" class="${PAGE === c.id ? 'cur' : ''}">${I.ui(c.icon)}<span>${c.label}<small>${c.desc}</small></span></a>`).join('')}</div>`
          : `<a class="dn-top ${PAGE === n.id ? 'cur' : ''}" href="${n.href}">${I.ui('home')}<span>${n.label}</span></a>`).join('')}</nav>
      </div>`;
  }
  function mountHeader() {
    const h = $('#site-header'); if (!h) return;
    h.className = 'siteheader'; h.innerHTML = headerHTML();
    // dropdowns: hover on desktop, click/keyboard everywhere
    $$('.has-dd', h).forEach(li => {
      const b = li.querySelector('button');
      const set = v => { li.classList.toggle('open', v); b.setAttribute('aria-expanded', String(v)); };
      b.addEventListener('click', e => { e.stopPropagation(); const v = !li.classList.contains('open'); $$('.has-dd.open', h).forEach(x => x !== li && x.classList.remove('open')); set(v); });
      li.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) set(true); });
      li.addEventListener('mouseleave', () => { if (matchMedia('(hover: hover)').matches) set(false); });
      li.addEventListener('keydown', e => { if (e.key === 'Escape') { set(false); b.focus(); } });
      li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) set(false); });
    });
    document.addEventListener('click', () => $$('.has-dd.open', h).forEach(x => { x.classList.remove('open'); x.querySelector('button').setAttribute('aria-expanded', 'false'); }));
    const menuBtn = $('[data-menu]', h), drawer = $('#navDrawer', h);
    menuBtn.addEventListener('click', () => { const open = drawer.hidden; drawer.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.innerHTML = I.ui(open ? 'close' : 'menu'); body.classList.toggle('nav-open', open); });
    let last = 0;
    addEventListener('scroll', () => { const y = scrollY; h.classList.toggle('scrolled', y > 8); h.classList.toggle('hide', y > 240 && y > last && !body.classList.contains('nav-open') && !openPop); last = y; }, { passive: true });
  }

  /* ---------------- footer ---------------- */
  function footerHTML() {
    const cols = NAV.filter(n => n.children).map(n => `<div class="fcol"><h3>${n.label}</h3>${n.children.map(c => `<a href="${c.href}">${c.label}</a>`).join('')}</div>`).join('');
    return `<div class="kolam-edge" aria-hidden="true"></div>
      <div class="fwrap">
        <div class="fbrand">
          <a class="brand notranslate" href="index.html">${I.logo()}<span><small>Deep Mapping of</small><b>Micro Water Bodies</b></span></a>
          <p>An interactive deep map of the historical, cultural, literary and environmental memories of India's overlooked ponds, tanks, canals, channels and lakes.</p>
          <p class="inst">Department of Humanities and Social Sciences<br>Indian Institute of Technology (Indian School of Mines) Dhanbad</p>
        </div>
        ${cols}
      </div>
      <div class="fbase">
        <p class="copy">© 2026 Deep Mapping of Micro Water Bodies. All rights reserved.</p>
        <p class="lic"><a href="licensing.html">${I.ui('cc')}${I.ui('by')}${I.ui('nc')}<span>Text and data licensed CC BY-NC 4.0</span></a></p>
        <p class="snd-credit">Soundscapes synthesised in code for this site — <a href="licensing.html#credits">sound &amp; media credits</a></p>
      </div>
      <button class="totop" aria-label="Back to top">${I.ui('arrowUp')}</button>`;
  }
  function mountFooter() {
    const f = $('#site-footer'); if (!f) return;
    f.className = 'sitefooter'; f.innerHTML = footerHTML();
    const top = $('.totop', f);
    addEventListener('scroll', () => top.classList.toggle('show', scrollY > 700), { passive: true });
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: REDUCED() ? 'auto' : 'smooth' }));
  }
  /* ---------------- welcome pop-up ---------------- */
  const GREET = [
    ['स्वागत है', 'hi'], ['স্বাগতম', 'bn'], ['સ્વાગત છે', 'gu'], ['ସ୍ୱାଗତ', 'or'], ['வணக்கம்', 'ta'], ['जोहार', 'sat'], ['प्रणाम', 'bho'], ['Welcome', 'en']
  ];
  function welcome() {
    if (body.dataset.welcome == null) return;
    let seen = false; try { seen = sessionStorage.getItem('dm-welcomed') === '1'; sessionStorage.setItem('dm-welcomed', '1'); } catch (e) { /* */ }
    if (seen) return;
    const w = document.createElement('div');
    w.className = 'welcome-pop'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Welcome');
    w.innerHTML = `<div class="wp-rings" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="wp-card">
        <div class="wp-logo">${I.logo()}</div>
        <div class="wp-words notranslate" aria-hidden="true">${GREET.map(([g, l], i) => `<span lang="${l}" style="--i:${i}">${g}</span>`).join('')}</div>
        <p class="wp-to">to the deep map of India's <em>micro water bodies</em></p>
        <div class="wp-layers">${['historical', 'cultural', 'literary', 'environmental'].map((k, i) => `<span style="--i:${i}">${I.layerMedallion(k)}</span>`).join('')}</div>
        <button class="wp-skip">Enter ${I.ui('next')}</button>
      </div>`;
    body.appendChild(w);
    requestAnimationFrame(() => w.classList.add('in'));
    const close = () => { if (w.classList.contains('out')) return; w.classList.add('out'); setTimeout(() => w.remove(), 900); };
    w.addEventListener('click', close);
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape' || e.key === 'Enter') { close(); document.removeEventListener('keydown', k); } });
    setTimeout(close, REDUCED() ? 1600 : 3300);
  }

  /* ---------------- sound switch ---------------- */
  function mountSound() {
    const S = window.DM_SOUND, btns = $$('[data-sound]');
    if (!S) { btns.forEach(b => b.hidden = true); return; }
    if (!ATLAS) S.scene(body.dataset.scene || 'theme');
    btns.forEach(b => b.addEventListener('click', e => { e.stopPropagation(); const on = S.toggle(); toast(on ? 'Sound on — ' + S.state().desc : 'Sound off'); }));
    S.onchange(st => btns.forEach(b => {
      b.innerHTML = I.ui(st.on ? 'sound' : 'mute') + '<span class="eq"><i></i><i></i><i></i></span>';
      b.classList.toggle('playing', st.playing); b.classList.toggle('await', st.on && !st.playing);
      const t = st.on ? (st.playing ? 'Sound on · ' + st.name : 'Sound on · tap anywhere to start') : 'Sound off';
      b.title = t; b.setAttribute('aria-label', t + ' — toggle sound');
    }));
  }

  /* ---------------- reveal on scroll (content stays visible without JS) ---------------- */
  function reveals() {
    const els = $$('.rv');
    if (!('IntersectionObserver' in window) || REDUCED()) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px 12% 0px' });
    els.forEach(e => { const r = e.getBoundingClientRect(); if (r.top < innerHeight * 1.1) e.classList.add('in'); else { e.classList.add('pre'); io.observe(e); } });
    addEventListener('beforeprint', () => els.forEach(e => e.classList.add('in')));
  }

  /* ---------------- motion: zigzag reveals and opposing scroll parallax (content pages only) ----------------
     [data-zz]      children slide in from alternate sides (left, right, left…) as they reach the screen
     [data-px]      "up" or "down": drifts against the scroll, so neighbours move in opposite directions
     [data-px-alt]  its children alternate up and down
     Parallax runs only on wide screens; everything is still when motion is reduced. */
  function zigzag() {
    if (!body.classList.contains('page')) return;
    $$('[data-zz]').forEach(box => [...box.children].forEach((c, i) => c.classList.add('rv', i % 2 ? 'zz-r' : 'zz-l')));
  }
  function parallax() {
    if (REDUCED() || !body.classList.contains('page')) return;
    $$('[data-px-alt]').forEach(box => [...box.children].forEach((c, i) => { if (!c.dataset.px) c.dataset.px = i % 2 ? 'down' : 'up'; }));
    const els = $$('[data-px]');
    if (!els.length) return;
    const wide = matchMedia('(min-width: 900px)');
    let queued = false;
    const run = () => {
      queued = false;
      const vh = innerHeight;
      els.forEach(el => {
        if (!wide.matches) { el.style.removeProperty('--py'); return; }
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const raw = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)));
        // still, and perfectly in line, while the block sits in the middle of the screen; drift only on the way in and out
        const band = Math.max(0, Math.abs(raw) - .32) / .68, k = Math.sign(raw) * band * band * (3 - 2 * band);
        const amp = +(el.dataset.pxAmp || 14);
        el.style.setProperty('--py', (k * amp * (el.dataset.px === 'down' ? -1 : 1)).toFixed(1) + 'px');
      });
    };
    const ask = () => { if (!queued) { queued = true; requestAnimationFrame(run); } };
    addEventListener('scroll', ask, { passive: true });
    addEventListener('resize', ask);
    root.classList.add('px-on');
    run();
  }

  /* ---------------- typewriter: headings type out letter by letter, text appears word by word ----------------
     The full text stays in the page for screen readers, search, printing and translation. The effect is
     skipped when motion is reduced and on pages opened through Google Translate. */
  function typewriter() {
    if (REDUCED() || PROXY || !body.classList.contains('page') || !('IntersectionObserver' in window)) return;
    const SKIP = '#site-header, #site-footer, nav, form, button, select, label, pre, code, kbd, .pop, .modal, .site-sheet, .crumbs, .stat-row, .marquee, .team-strip, .tags, .stack, .wbc, #grid, .cite-out, .no-tw, .hero-title, .toast, .lex-tools, .orbit, .url-list';
    const ok = el => !el.closest(SKIP) && !el.querySelector('input, textarea, select, button') && el.textContent.trim().length > 1;
    const heads = $$('main h1, main h2').filter(h => ok(h) && !h.querySelector('a, [tabindex]'));
    const texts = $$('main p, main blockquote, main li, main dd, main .sub, main figcaption, main .eyebrow, main h3, main h1, main h2')
      .filter(el => ok(el) && !heads.some(h => h.contains(el)) && !el.parentElement.closest('p, blockquote, li, dd, h3, figcaption'));
    const textNodes = el => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: n => n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }); const a = []; while (w.nextNode()) a.push(w.currentNode); return a; };

    function prepHead(h) {
      const clone = h.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
      textNodes(clone).forEach(t => {
        const frag = document.createDocumentFragment();
        t.nodeValue.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span'); w.className = 'tw-word';
          [...part].forEach(ch => { const c = document.createElement('span'); c.className = 'tw-c'; c.textContent = ch; w.appendChild(c); });
          frag.appendChild(w);
        });
        t.replaceWith(frag);
      });
      const sr = document.createElement('span'); sr.className = 'sr-only';
      while (h.firstChild) sr.appendChild(h.firstChild);
      const vis = document.createElement('span'); vis.className = 'tw-vis'; vis.setAttribute('aria-hidden', 'true');
      while (clone.firstChild) vis.appendChild(clone.firstChild);
      h.append(sr, vis);
      const chars = [...vis.querySelectorAll('.tw-c')];
      const step = Math.max(16, Math.min(42, 1400 / Math.max(chars.length, 1)));
      h._tw = { chars, step };
      return chars.length * step;
    }
    function typeHead(h, delay) {
      const { chars, step } = h._tw, caret = document.createElement('span');
      caret.className = 'tw-caret'; caret.setAttribute('aria-hidden', 'true');
      let k = 0;
      setTimeout(function tick() {
        const c = chars[k++];
        if (!c) { setTimeout(() => { caret.classList.add('bye'); setTimeout(() => caret.remove(), 600); h.classList.add('tw-done'); }, 1200); return; }
        c.classList.add('on'); c.after(caret);
        // a natural rhythm: a little pause after spaces and punctuation
        const next = chars[k], pause = next && next.parentElement !== c.parentElement ? step * 2.2 : /[,.:;]/.test(c.textContent) ? step * 4 : step;
        setTimeout(tick, pause * (0.75 + Math.random() * 0.5));
      }, delay);
    }
    function prepText(el) {
      let i = 0;
      textNodes(el).forEach(t => {
        const frag = document.createDocumentFragment();
        t.nodeValue.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span'); w.className = part.length > 22 ? 'tw-w tw-long' : 'tw-w'; w.style.setProperty('--i', i++); w.textContent = part; frag.appendChild(w);
        });
        // inside a flex or grid box every span would become its own item, so keep the words in one run
        if (/flex|grid/.test(getComputedStyle(t.parentNode).display)) { const run = document.createElement('span'); run.className = 'tw-run'; run.appendChild(frag); t.replaceWith(run); }
        else t.replaceWith(frag);
      });
      el.style.setProperty('--step', Math.max(6, Math.min(32, 1400 / Math.max(i, 1))) + 'ms');
      return i * Math.max(6, Math.min(32, 1400 / Math.max(i, 1)));
    }

    const all = [...new Set([...heads, ...texts])].sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    const dur = new Map();
    all.forEach(el => { try { const h = heads.includes(el); dur.set(el, h ? prepHead(el) : prepText(el)); el.classList.add('tw', h ? 'tw-h' : 'tw-t'); } catch (e) { /* leave this element as it is */ } });
    root.classList.add('tw-on');

    // elements that come into view together play one after another, top to bottom
    let queue = [], timer = null;
    const flush = () => {
      timer = null; let t = 0;
      queue.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1).forEach(el => {
        const d = dur.get(el) || 0;
        el.style.setProperty('--delay', t + 'ms'); el.classList.add('tw-go');
        if (el.classList.contains('tw-h') && el._tw) typeHead(el, t);
        else setTimeout(() => el.classList.add('tw-done'), t + d + 900);
        t += el.classList.contains('tw-h') ? Math.min(d * .7, 900) : Math.min(d * .3, 420);
      });
      queue = [];
    };
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target); queue.push(en.target);
      if (!timer) timer = setTimeout(flush, 60);
    }), { rootMargin: '0px 0px -6% 0px' });
    all.forEach(el => el.classList.contains('tw') && io.observe(el));
    addEventListener('beforeprint', () => all.forEach(el => { el.classList.add('tw-go', 'tw-done'); (el._tw ? el._tw.chars : []).forEach(c => c.classList.add('on')); }));
  }

  /* ---------------- flourishes: a water-line scroll gauge, filling numerals, drawn rules,
     rising image reveals, tilting cards and hero art that follows the pointer ---------------- */
  function flourishes() {
    if (REDUCED() || !body.classList.contains('page')) return;
    root.classList.add('fx-on');
    // 1. scroll gauge: a thin water line that fills as you read
    const gauge = document.createElement('div'); gauge.className = 'flow-gauge'; gauge.setAttribute('aria-hidden', 'true'); gauge.innerHTML = '<i></i>';
    body.appendChild(gauge);
    let q = false;
    const fill = () => { q = false; const h = document.documentElement.scrollHeight - innerHeight; gauge.style.setProperty('--p', h > 0 ? Math.min(1, scrollY / h) : 0); };
    addEventListener('scroll', () => { if (!q) { q = true; requestAnimationFrame(fill); } }, { passive: true }); fill();
    // 2–4. eyebrow rules draw in, outline numerals fill with water, pictures rise into view
    if ('IntersectionObserver' in window) {
      const seen = $$('main .eyebrow, main .ab-num, .shot img, .anno-wrap, .portrait .frame, .lg-card .fish, .layer-card .fish');
      const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
      seen.forEach(el => { const r = el.getBoundingClientRect(); el.classList.add('fx'); if (r.top < innerHeight * .92 && r.bottom > 0) requestAnimationFrame(() => setTimeout(() => el.classList.add('seen'), 250)); else io.observe(el); });
    }
    // 5. cards lean gently towards the pointer, with a soft light where it rests
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      $$('.card.lift, .lg-card, .m-card, .man-quick li, .how, .deed-col, .tool-card, .wbc').forEach(c => {
        if (getComputedStyle(c).position === 'static') c.style.position = 'relative';
        const sheen = document.createElement('span'); sheen.className = 'sheen'; sheen.setAttribute('aria-hidden', 'true'); c.appendChild(sheen);
        c.classList.add('tilt'); c.parentElement.style.perspective = '1100px';
        c.addEventListener('pointermove', e => {
          const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          const mag = Math.min(1, Math.hypot(x, y) * 1.6), deg = (c.offsetWidth > 520 ? 2.2 : 4) * mag;
          c.style.setProperty('--tilt', `${(-y).toFixed(3)} ${x.toFixed(3)} 0 ${deg.toFixed(2)}deg`);
          c.style.setProperty('--mx', ((x + .5) * 100).toFixed(1) + '%'); c.style.setProperty('--my', ((y + .5) * 100).toFixed(1) + '%');
        });
        c.addEventListener('pointerleave', () => { c.style.removeProperty('--tilt'); });
      });
      // 6. the page-header art drifts towards the pointer
      const art = $$('.ripple-art, #mandala');
      if (art.length) addEventListener('pointermove', e => {
        const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
        art.forEach(a => a.style.setProperty('--fx', `${(x * 16).toFixed(1)}px ${(y * 12).toFixed(1)}px`));
      }, { passive: true });
    }
  }

  /* ---------------- a drop-like ripple on buttons and cards (content pages only) ---------------- */
  function drips() {
    if (!body.classList.contains('page')) return;
    document.addEventListener('pointerdown', e => {
      if (REDUCED()) return;
      const el = e.target.closest('.btn, .card.lift, .chip, .wbc');
      if (!el) return;
      const r = el.getBoundingClientRect(), d = Math.min(Math.max(r.width, r.height) * 1.3, 420);
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      if (getComputedStyle(el).overflow !== 'hidden') el.style.overflow = 'hidden';
      [0, 1].forEach(() => {
        const s = document.createElement('span'); s.className = 'drip'; s.setAttribute('aria-hidden', 'true');
        s.style.cssText = `--x:${e.clientX - r.left}px;--y:${e.clientY - r.top}px;--d:${d}px`;
        el.appendChild(s); setTimeout(() => s.remove(), 1000);
      });
    }, { passive: true });
  }

  /* ---------------- copy helper used by cite/contact ---------------- */
  function copyText(text, btn) {
    const done = () => { if (btn) { const o = btn.innerHTML; btn.classList.add('ok'); btn.innerHTML = I.ui('check') + 'Copied'; setTimeout(() => { btn.classList.remove('ok'); btn.innerHTML = o; }, 1800); } toast('Copied to clipboard'); };
    const fallback = () => { const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0'; body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) { /* */ } ta.remove(); ok ? done() : toast('Select the text and copy it with Ctrl/⌘ + C'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  }

  /* ---------------- decorative ripple art for page headers ---------------- */
  function arts() {
    $$('[data-art]').forEach(n => {
      const k = n.dataset.art;
      let dots = ''; for (let i = 0; i < 36; i++) { const a = i * 10 * Math.PI / 180; dots += `<circle cx="${(100 + Math.cos(a) * 92).toFixed(1)}" cy="${(100 + Math.sin(a) * 92).toFixed(1)}" r="${i % 3 ? 1.2 : 2.2}"/>`; }
      let petals = ''; for (let i = 0; i < 12; i++) petals += `<path d="M100 22 C106 32 106 40 100 48 C94 40 94 32 100 22 Z" transform="rotate(${i * 30} 100 100)"/>`;
      n.innerHTML = `<svg viewBox="0 0 200 200" aria-hidden="true"><g class="spin" fill="var(--gold)">${dots}</g>
        <g class="spin-r" fill="none" stroke="var(--gold)" stroke-width=".8"><circle cx="100" cy="100" r="80" stroke-dasharray="2 5"/><circle cx="100" cy="100" r="70"/></g>
        <g class="spin" fill="color-mix(in srgb, var(--gold) 30%, transparent)" stroke="var(--gold)" stroke-width=".6">${petals}</g>
        <circle cx="100" cy="100" r="46" fill="var(--paper)" stroke="var(--line)"/></svg>
        <div style="position:absolute;inset:27%">${I.LAYERS[k] ? I.layerMedallion(k) : k === 'fish' ? I.fish('guide') : I.logo()}</div>`;
    });
  }

  /* ---------------- page menu for the full-screen map ---------------- */
  let sheet = null;
  function openMenu() {
    if (!sheet) {
      sheet = document.createElement('div'); sheet.className = 'site-sheet'; sheet.id = 'siteSheet';
      sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'All pages');
      sheet.innerHTML = `<div class="ss-panel"><div class="ss-head"><a class="ss-brand notranslate" href="index.html">${I.logo()}<span><small>Deep Mapping of</small><b>Micro Water Bodies</b></span></a><button class="ss-x" aria-label="Close menu">${I.ui('close')}</button></div>
        <nav aria-label="All pages">${NAV.map(n => n.children ? `<div class="ss-h">${n.label}</div>${n.children.map(c => `<a href="${c.href}" >${I.ui(c.icon)}<span>${c.label}<small>${c.desc}</small></span></a>`).join('')}` : `<a href="${n.href}">${I.ui('home')}<span>${n.label}</span></a>`).join('')}</nav>
        <p class="ss-foot">© 2026 Deep Mapping of Micro Water Bodies. All rights reserved.</p></div>`;
      body.appendChild(sheet);
      sheet.addEventListener('click', e => { if (e.target === sheet || e.target.closest('.ss-x')) closeMenu(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheet.classList.contains('open')) closeMenu(); });
    }
    sheet.classList.add('open'); const x = sheet.querySelector('.ss-x'); x && x.focus();
  }
  function closeMenu() { if (sheet) sheet.classList.remove('open'); }

  /* ---------------- boot ---------------- */
  arts();
  $$('[data-ui-ico]').forEach(n => { n.innerHTML = I.ui(n.dataset.uiIco); });
  $$('[data-medal]').forEach(n => { n.innerHTML = I.layerMedallion(n.dataset.medal); });
  makePop('a11yPop', a11yHTML());
  makePop('langPop', langHTML());
  mountHeader(); mountFooter();
  document.addEventListener('click', e => { const b = e.target.closest('[data-pop]'); if (b) { e.stopPropagation(); togglePop(b.dataset.pop, b); } });
  paintA11y(); loadReadableFont();
  $$('.deva, .beng').forEach(n => n.classList.add('notranslate'));
  paintLang(curLang());
  mountSound();
  welcome();
  const ready = () => { zigzag(); reveals(); typewriter(); parallax(); flourishes(); drips(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => copyText(b.dataset.copy || $(b.dataset.copyFrom).innerText, b)));

  window.DM_SITE = { originalURL, PROXY, openMenu, closeMenu, toast, copyText, togglePop, closePops, prefs, setLang, EMAIL, NAV, TEAM };
})();
