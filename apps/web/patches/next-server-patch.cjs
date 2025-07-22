// Patch for Next.js SSR "self is not defined" issue
// This patches the Next.js server runtime to define global browser APIs

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

// Export for require
module.exports = {};
