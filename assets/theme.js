(function () {
  var STORAGE_KEY = 'flightway-theme';
  var root = document.documentElement;

  function getStored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch (e) {
      return null;
    }
  }

  function updateToggles(theme) {
    document.querySelectorAll('.fw-theme-toggle').forEach(function (btn) {
      var isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      var icon = btn.querySelector('.fw-theme-icon');
      if (icon) {
        icon.innerHTML = isDark
          ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
          : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      }
    });
  }

  function apply(theme, opts) {
    opts = opts || {};
    var prev = root.getAttribute('data-theme');
    if (prev === theme) {
      updateToggles(theme);
      return;
    }
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    updateToggles(theme);
    if (!opts.silent) {
      window.dispatchEvent(new CustomEvent('flightway-theme-change', { detail: { theme: theme } }));
    }
  }

  function enableTransitions() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.add('theme-ready');
      });
    });
  }

  function init() {
    var theme = getStored() || 'dark';
    apply(theme, { silent: true });
    enableTransitions();

    document.querySelectorAll('.fw-theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
        apply(next);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
