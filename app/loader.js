/* Stock scanner loader, generated 2026-10-30 11:56 IST. Do not edit: the system rewrites it from Admin > Site settings. */
(function(){
  var CFG = {"brand":"","appName":"Stock Scanner","title":"Stock Scanner","short":"Stock Scanner","orgName":"","orgUrl":"","regNote":"","disclaimer":"Fully automatic screener based on technical rules, for educational reference only. Not a buy/sell recommendation. Please contact a SEBI-registered investment adviser. We shall not be responsible for any profit or loss from using this data.","siteUrl":"","scannerPath":"stock-scanner","marketPath":"share-market-today","scannerUrl":"https://mnclgroup-mum.github.io/stock-scanner-data/stock-scanner/","marketUrl":"https://mnclgroup-mum.github.io/stock-scanner-data/share-market-today/","webHosts":[],"hosts":["localhost","127.0.0.1","mnclgroup-mum.github.io"],"legacyPrefix":"","privacyUrl":"","ogImage":"","guideBase":"","ctaText":"","ctaUrl":"","pathRoutes":false,"pagesBase":"https://mnclgroup-mum.github.io/stock-scanner-data/","dataBase":"https://mnclgroup-mum.github.io/stock-scanner-data/data/","dataRaw":"https://raw.githubusercontent.com/mnclgroup-mum/stock-scanner-data/main/data/","hide":["setup:intraday","setup:swing","setup:positional","setup:weak","setup:reversal","setup:accumulation","tab:track","tab:ideas"],"gas":"https://script.google.com/macros/s/AKfycbyq3rAvyse__FASkf1JB1n61NSalgqmnxfY7K8FS1g_HjtJ3hdG1OUfVFLRtzzSDOWM/exec","v":"v12.1","publisher":"Stock Scanner","home":"https://mnclgroup-mum.github.io/stock-scanner-data/","loader":"https://mnclgroup-mum.github.io/stock-scanner-data/app/loader.js"};
  var BASE = "https://mnclgroup-mum.github.io/stock-scanner-data/app/", V = {"screener":"20261030115652","market":"20261028173034"}, LIVE = [];
  var SITE_HOSTS = CFG.hosts, PFX = CFG.legacyPrefix || '';
  var SITE = CFG.siteUrl || CFG.pagesBase, HUB = { screener: CFG.scannerUrl, market: CFG.marketUrl };
  function hostOk(list, hn){ hn = String(hn || '').toLowerCase(); if (hn === '') return true; return (list || []).some(function(x){ x = String(x || '').toLowerCase(); if (!x) return false; return x.charAt(0) === '.' ? (hn === x.slice(1) || hn.slice(-x.length) === x) : (hn === x || hn === 'www.' + x || 'www.' + hn === x); }); }
  var el = document.getElementById('scanner-app') || (PFX ? document.getElementById(PFX + '-app') : null);
  // Several website domains can hold the pages: links stay on the domain the visitor is on.
  if (/^https?:$/.test(location.protocol) && CFG.siteUrl && hostOk(CFG.webHosts.concat([String(CFG.siteUrl).replace(/^[a-z]+:\/\/([^\/:]+).*$/i, '$1')]), location.hostname)) {
    var cur = location.origin + '/', prim = String(CFG.siteUrl);
    if (cur !== prim) { HUB = { screener: cur + CFG.scannerPath, market: cur + CFG.marketPath }; SITE = cur; }
  }
  var C2 = {}; for (var k in CFG) C2[k] = CFG[k]; C2.scannerUrl = HUB.screener; C2.marketUrl = HUB.market; if (CFG.siteUrl) C2.siteUrl = SITE;
  window.SCANNER_SITE = C2;
  if (!el || el.getAttribute('data-loaded')) return;
  var hn = location.hostname.toLowerCase();
  if (!hostOk(SITE_HOSTS, hn)) { el.innerHTML = '<p>This tool is available on <a href="' + SITE + '">' + String(SITE).replace(/^[a-z]+:\/\/|\/.*$/gi, '') + '</a>.</p>'; return; }
  el.setAttribute('data-loaded', '1');
  var app = el.getAttribute('data-app') === 'market' ? 'market' : 'screener', page = (el.getAttribute('data-page') || '').toLowerCase();
  var path = location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  window.SCANNER_PAGE = { app: app, slug: page && path === page ? page : '', live: LIVE, site: SITE };
  function fix(a){
    var href = a.getAttribute('href') || '', k, m;
    for (k in HUB) if (href.indexOf(HUB[k] + '#') === 0) { m = href.slice(HUB[k].length + 1); break; }
    if (m === undefined) return;
    var slug = m.split('/')[0].split('?')[0];
    if (LIVE.indexOf(slug) !== -1) a.setAttribute('href', SITE + slug + (m !== slug ? '#' + m : ''));
  }
  function fixAll(root){ if (!LIVE.length || !root.querySelectorAll) return; Array.prototype.forEach.call(root.querySelectorAll('a[href^="http"]'), fix); }
  function fail(){ el.insertAdjacentHTML('beforeend', '<p><a href="' + HUB[app] + '">Open the ' + (app === 'market' ? 'share market today page' : (CFG.title || 'stock scanner')) + '</a></p>'); }
  // [v12.1] the latest settings (Admin > Site settings and Sections), so a change shows within a minute even if this file is cached
  function fresh(){
    if (!CFG.dataBase || !window.fetch) return Promise.resolve();
    var get = fetch(CFG.dataBase + 'site.json?t=' + Math.floor(Date.now() / 60000), { cache: 'no-store' }).then(function(r){ return r.ok ? r.json() : null; })
      .then(function(d){ if (!d || typeof d !== 'object') return; for (var k in d) if (k !== 'scannerUrl' && k !== 'marketUrl' && k !== 'siteUrl') C2[k] = d[k]; }).catch(function(){});
    return Promise.race([get, new Promise(function(res){ setTimeout(res, 2500); })]);
  }
  fresh().then(function(){ return fetch(BASE + app + '.txt?v=' + encodeURIComponent(V[app] || '')); }).then(function(r){ if (!r.ok) throw new Error(r.status); return r.text(); }).then(function(html){
    function parts(tag){ return html.split('<!--' + tag + '-->').slice(1).map(function(x){ return x.split('<!--/' + tag + '-->')[0]; }).join('\n'); }
    // App only: the page itself holds the search content. Shared styles come along unless the page already has them.
    if (el.getAttribute('data-part') === 'app' && html.indexOf('<!--SCANNER-APP-->') !== -1) html = (document.querySelector('style[data-scanner-css]' + (PFX ? ',style[data-' + PFX + '-css]' : '')) ? '' : parts('SCANNER-CSS')) + parts('SCANNER-APP');
    var box = document.createElement('div'); box.innerHTML = html;
    var sub = !!window.SCANNER_PAGE.slug;
    // Head-only tags in the page code belong to the main page; this page has its own from the CMS.
    Array.prototype.forEach.call(box.querySelectorAll('meta,title,link[rel="canonical"]' + (sub ? ',script[type="application/ld+json"]' : '')), function(n){ n.parentNode.removeChild(n); });
    var scripts = Array.prototype.slice.call(box.querySelectorAll('script'));
    scripts.forEach(function(s){ s.parentNode.removeChild(s); });
    el.innerHTML = '';
    while (box.firstChild) el.appendChild(box.firstChild);
    // A page heading written in the page itself replaces the app's own heading (the app keeps updating it).
    var sh = document.querySelector('[data-scanner-h1]' + (PFX ? ',[data-' + PFX + '-h1]' : '')), ah = el.querySelector('#mk-h1');
    if (sh && ah) { ah.parentNode.removeChild(ah); sh.id = 'mk-h1'; }
    (function next(i){
      if (i >= scripts.length) { fixAll(el); if (window.MutationObserver && LIVE.length) new MutationObserver(function(ms){ ms.forEach(function(m){ Array.prototype.forEach.call(m.addedNodes, function(n){ if (n.nodeType === 1) { if (n.tagName === 'A') fix(n); fixAll(n); } }); }); }).observe(el, { childList: true, subtree: true }); return; }
      var o = scripts[i], s = document.createElement('script');
      Array.prototype.forEach.call(o.attributes, function(at){ s.setAttribute(at.name, at.value); });
      if (o.src) { s.onload = s.onerror = function(){ next(i + 1); }; el.appendChild(s); }
      else { s.text = o.text; el.appendChild(s); next(i + 1); }
    })(0);
  }).catch(fail);
})();
