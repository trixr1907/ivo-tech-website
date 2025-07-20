/* eslint-disable no-undef */
// @ts-nocheck
// GlobalThis polyfill
(function() {
  if (typeof globalThis === 'object') return;
  
  Object.defineProperty(Object.prototype, '__magic__', {
    get: function() {
      return this;
    },
    configurable: true
  });
  
  __magic__.globalThis = __magic__;
  delete Object.prototype.__magic__;
}());

// Export for webpack alias
if (typeof module !== 'undefined' && module.exports) {
  module.exports = globalThis;
}
