"use strict";

(function () {
  function deriveLang(el) {
    try {
      var dl = el.getAttribute('data-lang');
      if (dl) return dl;
      var cls = el.className || '';
      var m = cls.match(/highlight-([a-z0-9_+-]+)/i);
      if (m && m[1]) return m[1];
      var pre = el.querySelector('pre[class], code[class]');
      if (pre && pre.className) {
        var lm = pre.className.match(/language-([a-z0-9_+-]+)/i);
        if (lm && lm[1]) return lm[1];
      }
    } catch (_) {}
    return '';
  }

  function enhanceCodeblocks() {
    var blocks = document.querySelectorAll('.highlight');
    for (var i = 0; i < blocks.length; i++) {
      var h = blocks[i];
      if (h.querySelector(':scope > .code-tools')) continue; // already enhanced
      h.style.position = h.style.position || 'relative';
      var tools = document.createElement('div');
      tools.className = 'code-tools';
      var lang = deriveLang(h);
      if (lang) {
        var pill = document.createElement('span');
        pill.className = 'code-lang';
        pill.textContent = lang;
        tools.appendChild(pill);
      }

      // Copy button (GitHub-style small pill)
      var copyBtn = document.createElement('button');
      copyBtn.className = 'copy-button';
      copyBtn.type = 'button';
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      copyBtn.textContent = 'Copy';

      copyBtn.addEventListener('click', (function(container, btn){
        return function(){
          try {
            // Prefer the code content cell when line numbers table is present
            var pre = container.querySelector('.chroma .lntable .lntd:last-child pre') || container.querySelector('.chroma pre') || container.querySelector('pre');
            if (!pre) return;
            var text = pre.innerText.replace(/\s+$/,'');
            var done = function(){
              var old = btn.textContent;
              btn.textContent = 'Copied';
              btn.disabled = true;
              setTimeout(function(){ btn.textContent = old; btn.disabled = false; }, 1200);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(done).catch(function(){
                // Fallback
                var ta = document.createElement('textarea');
                ta.value = text; document.body.appendChild(ta); ta.select();
                document.execCommand('copy'); document.body.removeChild(ta); done();
              });
            } else {
              var ta = document.createElement('textarea');
              ta.value = text; document.body.appendChild(ta); ta.select();
              document.execCommand('copy'); document.body.removeChild(ta); done();
            }
          } catch (e) {
            if (window.console && console.warn) console.warn('Copy failed:', e);
          }
        };
      })(h, copyBtn));

      tools.appendChild(copyBtn);
      h.insertBefore(tools, h.firstChild);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceCodeblocks);
  } else {
    enhanceCodeblocks();
  }
})();

