/**
 * Custom icon replacement system - replaces 72KB Feather Icons library
 * Size: ~2KB (97% reduction)
 */
(function() {
  'use strict';

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
