(function () {
  function pageFromDom() {
    if (document.body.classList.contains('hub-page')) return 'hub';
    var hash = (location.hash || '').replace(/^#/, '');
    if (hash === 'coach') return 'advisor';
    if (hash === 'quiz') return 'quiz';
    var active = document.querySelector('.page.active');
    if (!active) return null;
    if (active.id === 'page-coach') return 'advisor';
    if (active.id === 'page-quiz') return 'quiz';
    return null;
  }

  function sync(active) {
    active = active || pageFromDom();
    document.querySelectorAll('[data-app-nav]').forEach(function (el) {
      var key = el.getAttribute('data-app-nav');
      var on = key === active;
      el.classList.toggle('is-active', on);
      if (el.tagName === 'A') {
        el.setAttribute('aria-current', on ? 'page' : 'false');
      } else {
        el.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    });
  }

  window.FWAppNav = { sync: sync, pageFromDom: pageFromDom };

  function boot() {
    sync();
    window.addEventListener('hashchange', sync);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
