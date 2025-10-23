/**
 * Bundled initialization script
 * Combines: icons-custom.js, share-init.js, codeblock-init.js
 * Reduces HTTP requests from 3 to 1
 */
"use strict";

// ===== ICONS CUSTOM =====
(function() {
  // Icon replacement function
  function replaceIcons() {
    const icons = document.querySelectorAll('[data-feather]');

    icons.forEach(function(element) {
      const iconName = element.getAttribute('data-feather');
      const iconId = 'icon-' + iconName;

      // Create SVG use element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');

      // Set attributes
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.setAttribute('class', 'feather feather-' + iconName);
      svg.setAttribute('aria-hidden', element.getAttribute('aria-hidden') || 'true');

      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + iconId);
      use.setAttribute('href', '#' + iconId);

      svg.appendChild(use);

      // Replace the placeholder element
      if (element.parentNode) {
        element.parentNode.replaceChild(svg, element);
      }
    });
  }

  // Expose replace function for compatibility with existing code
  window.feather = window.feather || {};
  window.feather.replace = replaceIcons;

  // Icon objects for theme toggle (used in main.js)
  window.feather.icons = window.feather.icons || {};

  window.feather.icons.sun = {
    toSvg: function() {
      return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><use href="#icon-sun"></use></svg>';
    }
  };

  window.feather.icons.moon = {
    toSvg: function() {
      return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><use href="#icon-moon"></use></svg>';
    }
  };

  // Auto-replace on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceIcons);
  } else {
    replaceIcons();
  }
})();

// ===== SHARE INIT =====
(function(){
  function onCopyClick(e){
    var btn = e.currentTarget;
    var url = btn.getAttribute('data-copy-url') || window.location.href;
    var done = function(){
      var old = btn.textContent;
      btn.textContent = 'Copied';
      btn.disabled = true;
      setTimeout(function(){ btn.textContent = old || 'Copy Link'; btn.disabled = false; }, 1200);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(function(){
          var ta = document.createElement('textarea');
          ta.value = url; document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); document.body.removeChild(ta); done();
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = url; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta); done();
      }
    } catch(_){}
  }

  function initShare(){
    var copyBtns = document.querySelectorAll('.social-share .share-copy');
    for (var i=0;i<copyBtns.length;i++){
      copyBtns[i].addEventListener('click', onCopyClick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShare);
  } else {
    initShare();
  }
})();

// ===== CODEBLOCK INIT =====
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
