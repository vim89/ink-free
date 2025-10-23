/**
 * Error tracking and monitoring
 * Captures JavaScript errors and unhandled promise rejections for debugging
 */
(function() {
  'use strict';

  // Only enable in development or when explicitly enabled
  var isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  var enableTracking = isDev || (window.localStorage && localStorage.getItem('enableErrorTracking') === 'true');

  if (!enableTracking) {
    return;
  }

  // Error queue for batching
  var errorQueue = [];
  var MAX_ERRORS = 10;

  // Log error to console with formatting
  function logError(errorData) {
    if (window.console && console.error) {
      console.error('%c[Error Tracker]', 'color: #ff5555; font-weight: bold', errorData);
    }

    // Add to queue
    if (errorQueue.length < MAX_ERRORS) {
      errorQueue.push(errorData);
    }
  }

  // Global error handler
  window.addEventListener('error', function(e) {
    var errorData = {
      type: 'error',
      message: e.message,
      source: e.filename,
      line: e.lineno,
      column: e.colno,
      stack: e.error ? e.error.stack : null,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    logError(errorData);

    // Don't prevent default error handling
    return false;
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', function(e) {
    var errorData = {
      type: 'unhandledRejection',
      reason: e.reason,
      promise: e.promise,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    logError(errorData);
  });

  // Resource loading errors
  window.addEventListener('error', function(e) {
    if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
      var errorData = {
        type: 'resourceError',
        tagName: e.target.tagName,
        src: e.target.src || e.target.href,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      logError(errorData);
    }
  }, true);

  // Expose error queue for debugging
  if (isDev) {
    window.__errorQueue = errorQueue;
    console.log('%c[Error Tracker] Initialized', 'color: #50fa7b; font-weight: bold');
    console.log('%cTo view errors, check: window.__errorQueue', 'color: #8be9fd');
  }
})();
