(function () {
  function captureSources() {
    try {
      var blocks = document.querySelectorAll('.mermaid');
      for (var i = 0; i < blocks.length; i++) {
        var el = blocks[i];
        if (!el.getAttribute('data-mermaid-src')) {
          el.setAttribute('data-mermaid-src', el.textContent);
        }
      }
    } catch (_) {}
  }

  function currentDark() {
    try { return document.documentElement.classList.contains('dark'); } catch (_) { return false; }
  }

  function initMermaid() {
    try {
      if (!window.mermaid || typeof window.mermaid.initialize !== 'function') return;

      captureSources();

      window.mermaid.initialize({
        startOnLoad: true,
        theme: currentDark() ? 'dark' : 'default'
      });
    } catch (e) {
      if (window && window.console && console.error) console.error('Mermaid initialization failed:', e);
    }
  }

  function reRenderMermaid() {
    try {
      if (!window.mermaid || typeof window.mermaid.initialize !== 'function') return;
      // Reconfigure theme, then re-run all blocks from stored sources
      window.mermaid.initialize({ startOnLoad: false, theme: currentDark() ? 'dark' : 'default' });
      var blocks = document.querySelectorAll('.mermaid');
      for (var i = 0; i < blocks.length; i++) {
        var el = blocks[i];
        var src = el.getAttribute('data-mermaid-src') || el.textContent || '';
        el.innerHTML = src; // reset
        el.removeAttribute('data-processed');
      }
      if (typeof window.mermaid.run === 'function') {
        window.mermaid.run({querySelector:'.mermaid'});
      } else if (typeof window.mermaid.init === 'function') {
        window.mermaid.init(undefined, '.mermaid');
      }
    } catch (e) {
      if (window && window.console && console.warn) console.warn('Mermaid re-render failed:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMermaid);
  } else {
    initMermaid();
  }

  // Watch for theme toggle (.dark on <html>) and re-render diagrams
  try {
    var observer = new MutationObserver(function(mutations){
      for (var i=0;i<mutations.length;i++) {
        if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'class') {
          reRenderMermaid();
          break;
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  } catch(_) {}
})();

