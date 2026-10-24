/* MNCL screener loader, generated 2026-10-24 15:22 IST. Do not edit: the system rewrites it. */
(function(){
  var BASE = "https://mnclgroup-mum.github.io/stock-scanner-data/app/", V = {"screener":"20261024152210","market":"20261024152220"}, LIVE = [];
  var SITE_HOSTS = ["localhost","127.0.0.1","192.168.112.254","mnclgroup.com",".mnclgroup.com","mnclgroup-mum.github.io",".mohit-jain.workers.dev"];
  var SITE = "https://www.mnclgroup.com/", HUB = { screener: "https://www.mnclgroup.com/candlestick-patterns", market: "https://www.mnclgroup.com/share-market-today" };
  var el = document.getElementById('mncl-app');
  if (!el || el.getAttribute('data-loaded')) return;
  var hn = location.hostname.toLowerCase();
  if (!(hn === '' || SITE_HOSTS.some(function(x){ return x.charAt(0) === '.' ? hn.slice(-x.length) === x : hn === x; }))) { el.innerHTML = '<p>This tool is available on <a href="' + SITE + '">mnclgroup.com</a>.</p>'; return; }
  el.setAttribute('data-loaded', '1');
  var app = el.getAttribute('data-app') === 'market' ? 'market' : 'screener', page = (el.getAttribute('data-page') || '').toLowerCase();
  var path = location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  window.MNCL_PAGE = { app: app, slug: page && path === page ? page : '', live: LIVE, site: SITE };
  function fix(a){
    var href = a.getAttribute('href') || '', k, m;
    for (k in HUB) if (href.indexOf(HUB[k] + '#') === 0) { m = href.slice(HUB[k].length + 1); break; }
    if (m === undefined) return;
    var slug = m.split('/')[0].split('?')[0];
    if (LIVE.indexOf(slug) !== -1) a.setAttribute('href', SITE + slug + (m !== slug ? '#' + m : ''));
  }
  function fixAll(root){ if (!LIVE.length || !root.querySelectorAll) return; Array.prototype.forEach.call(root.querySelectorAll('a[href^="http"]'), fix); }
  function fail(){ el.insertAdjacentHTML('beforeend', '<p><a href="' + HUB[app] + '">Open the ' + (app === 'market' ? 'share market today page' : 'MNCL stock screener') + '</a></p>'); }
  fetch(BASE + app + '.txt?v=' + encodeURIComponent(V[app] || '')).then(function(r){ if (!r.ok) throw new Error(r.status); return r.text(); }).then(function(html){
    function parts(tag){ return html.split('<!--' + tag + '-->').slice(1).map(function(x){ return x.split('<!--/' + tag + '-->')[0]; }).join('\n'); }
    // App only: the page itself holds the search content. Shared styles come along unless the page already has them.
    if (el.getAttribute('data-part') === 'app' && html.indexOf('<!--MNCL-APP-->') !== -1) html = (document.querySelector('style[data-mncl-css]') ? '' : parts('MNCL-CSS')) + parts('MNCL-APP');
    var box = document.createElement('div'); box.innerHTML = html;
    var sub = !!window.MNCL_PAGE.slug;
    // Head-only tags in the page code belong to the main page; this page has its own from the CMS.
    Array.prototype.forEach.call(box.querySelectorAll('meta,title,link[rel="canonical"]' + (sub ? ',script[type="application/ld+json"]' : '')), function(n){ n.parentNode.removeChild(n); });
    var scripts = Array.prototype.slice.call(box.querySelectorAll('script'));
    scripts.forEach(function(s){ s.parentNode.removeChild(s); });
    el.innerHTML = '';
    while (box.firstChild) el.appendChild(box.firstChild);
    // A page heading written in the page itself replaces the app's own heading (the app keeps updating it).
    var sh = document.querySelector('[data-mncl-h1]'), ah = el.querySelector('#mk-h1');
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
