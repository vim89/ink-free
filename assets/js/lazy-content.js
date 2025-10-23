/**
 * Lazy content loading with Intersection Observer
 * Improves initial page load performance by deferring below-the-fold content
 */
(function() {
  'use strict';

  // Check for Intersection Observer support
  if (!('IntersectionObserver' in window)) {
    // Fallback: make all content visible immediately
    document.querySelectorAll('.lazy-load').forEach(function(el) {
      el.classList.add('visible');
    });
    return;
  }

  // Configuration
  var config = {
    rootMargin: '50px 0px', // Start loading 50px before element enters viewport
    threshold: 0.01 // Trigger when even 1% is visible
  };

  // Create observer
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Element is now visible
        var target = entry.target;

        // Add visible class for CSS transitions
        target.classList.add('visible');

        // Load lazy images if present
        var lazyImages = target.querySelectorAll('img[data-src]');
        lazyImages.forEach(function(img) {
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
        });

        // Stop observing this element
        observer.unobserve(target);
      }
    });
  }, config);

  // Initialize lazy loading
  function initLazyLoading() {
    // Observe all posts (below-the-fold content)
    var posts = document.querySelectorAll('.post');
    var firstPost = posts[0];

    posts.forEach(function(post, index) {
      // Keep first 2 posts immediately visible (above the fold)
      if (index < 2) {
        post.classList.add('visible');
      } else {
        post.classList.add('lazy-load');
        observer.observe(post);
      }
    });

    // Observe other lazy-loadable elements
    document.querySelectorAll('.lazy-load').forEach(function(el) {
      if (!el.classList.contains('post')) {
        observer.observe(el);
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
  } else {
    initLazyLoading();
  }
})();
