/* CEF 2026 — projector-proof presentation stage.
   Fullscreen renders every slide at a fixed 1280px design width and
   its NATURAL height, then scales ALL slides by ONE uniform factor —
   sized to the TALLEST slide — so:
     • content is the SAME size on every slide (consistent), and
     • nothing is ever clipped (the tallest slide still fits).
   The slide background fills the screen (no floating card / no bars);
   the scaled content is centered. Adapts to any display — 16:9 / 16:10
   / 4:3 — no stretch, crop or clip. Sets CSS var --fit.
   ?stage in the URL = windowed preview (resize the window to test
   any projector shape without a second screen). */
(function () {
  var SW = 1280, MAXS = 2.2, MARGIN = 0.96, maxH = 720;
  var previewWanted = location.search.indexOf('stage') >= 0 || location.hash.indexOf('stage') >= 0;

  function container() { return document.querySelector('.presentation-container'); }
  function staged() { var c = container(); return c && c.classList.contains('fullscreen-mode'); }

  // measure the natural (unscaled) height of EVERY slide-body — even inactive/hidden ones — and keep the tallest
  function measureMax() {
    if (!staged()) return;
    var slides = document.querySelectorAll('.presentation-container.fullscreen-mode .slide');
    var m = 0;
    slides.forEach(function (sl) {
      var b = sl.querySelector('.slide-body'); if (!b) return;
      var prev = sl.getAttribute('style') || '';
      var prevTr = b.style.transform;
      sl.style.cssText += ';display:block;visibility:hidden;position:absolute;left:-99999px;top:0;';
      b.style.transform = 'none';
      var hh = b.offsetHeight;              // layout height at the fixed 1280 design width
      b.style.transform = prevTr;
      sl.setAttribute('style', prev);
      if (hh > m) m = hh;
    });
    if (m > 0) maxH = m;
  }

  function fit() {
    var root = document.documentElement;
    if (!staged()) { root.style.removeProperty('--fit'); return; }
    // ONE uniform scale for EVERY slide, sized to the tallest => same content size everywhere, never clipped.
    // Slightly tighter vertical margin (0.93) reserves a clean bottom gutter for the running credit.
    var s = Math.min(window.innerWidth * MARGIN / SW, window.innerHeight * 0.93 / maxH, MAXS);
    root.style.setProperty('--fit', s);
  }
  function refitAll() { measureMax(); fit(); }

  function enablePreview() {
    var c = container(); if (!c) return;
    document.body.classList.add('fullscreen-active');
    c.classList.add('fullscreen-mode');
    setTimeout(function () { try { if (window.closureChartInstance) window.closureChartInstance.resize(); } catch (_) {} refitAll(); }, 90);
  }

  window.addEventListener('resize', refitAll);
  window.addEventListener('load', function () { setTimeout(refitAll, 50); });
  window.addEventListener('hashchange', function () { setTimeout(fit, 20); });   // slide change: same scale
  document.addEventListener('keydown', function (e) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown'].indexOf(e.key) >= 0) setTimeout(fit, 30);
  });
  document.addEventListener('fullscreenchange', function () { setTimeout(refitAll, 130); });
  var fb = document.getElementById('fullscreenBtn');
  if (fb) fb.addEventListener('click', function () { setTimeout(refitAll, 150); setTimeout(refitAll, 430); });

  // running speaker credit: light text on the ink (title/conclusion) slides, ink text on paper slides
  function syncCredit() {
    var a = document.querySelector('.slide.active'), c = document.getElementById('deckCredit');
    if (!a || !c) return;
    var dark = a.classList.contains('title-slide') || a.classList.contains('conclusion-slide');
    if (c.classList.contains('on-dark') !== dark) c.classList.toggle('on-dark', dark);
  }
  var cont = container();
  if (cont && window.MutationObserver) {
    new MutationObserver(syncCredit).observe(cont, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }
  syncCredit();

  if (previewWanted) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enablePreview);
    else enablePreview();
  }
  setTimeout(function () { syncCredit(); refitAll(); }, 280);
})();
