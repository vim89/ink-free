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

    var enableDeferredStyles = function() {
      if (typeof document === 'undefined' || !document.querySelectorAll) {
        return;
      }
      var links = document.querySelectorAll('link[data-preload-css]');
      if (!links || !links.length) {
        return;
      }
      var promote = function(link) {
        var activate = function() {
          try {
            if (link.media !== 'all') {
              link.media = 'all';
            }
            link.removeAttribute('data-preload-css');
          } catch (err) {
            // Ignore failures
          }
        };
        if (link.addEventListener) {
          link.addEventListener('load', activate, { once: true });
        }
        // Fallback in case load never fires (cached)
        setTimeout(activate, 3000);
        // If stylesheet is already parsed (from cache), promote immediately.
        if (link.sheet) {
          activate();
        }
      };
      for (var i = 0; i < links.length; i++) {
        promote(links[i]);
      }
    };

    if (typeof document !== 'undefined' && document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enableDeferredStyles, { once: true });
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('load', enableDeferredStyles, { once: true });
      }
    } else {
      enableDeferredStyles();
    }
  } catch (e) {
    // Fail silently - default theme will be used
  }
})();
