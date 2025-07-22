// Server-side polyfills
if (typeof self === 'undefined') {
  global.self = global;
}

if (typeof window === 'undefined') {
  global.window = {
    location: { href: '', pathname: '', search: '', hash: '' },
    navigator: { userAgent: 'node' },
    document: {
      createElement: () => ({}),
      createTextNode: () => ({}),
      querySelector: () => null,
      querySelectorAll: () => [],
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: clearTimeout,
    performance: { now: () => Date.now() },
  };
}

// Ensure global references are consistent
if (typeof globalThis === 'undefined') {
  global.globalThis = global;
}

// Export an empty object since this is just for side effects
module.exports = {};
