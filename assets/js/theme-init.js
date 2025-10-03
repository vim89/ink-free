// Early theme initialization to prevent FOUC (Flash of Unstyled Content)
// This must run before CSS to avoid theme flicker
(function() {
  'use strict';
  try {
    // Get theme mode from Hugo site params (injected via data attribute)
    var mode = document.documentElement.getAttribute('data-theme-mode') || 'auto';
    var savedTheme = null;

    try {
      savedTheme = localStorage.getItem('theme');
    } catch (e) {
      // localStorage might be blocked
    }

    var prefersDark = false;
    try {
      prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      // matchMedia not supported
    }

    var shouldUseDark = (savedTheme === 'dark') ||
                        (!savedTheme && (mode === 'dark' || (mode === 'auto' && prefersDark)));

    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    // Fail silently - default theme will be used
  }
})();
