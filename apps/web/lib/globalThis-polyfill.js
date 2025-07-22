// @ts-nocheck
/* eslint-disable */

// Comprehensive polyfill for browser globals in SSR environment
(function() {
  'use strict';
  
  // Define globalThis if not available
  if (typeof globalThis === 'undefined') {
    if (typeof self !== 'undefined') {
      self.globalThis = self;
    } else if (typeof window !== 'undefined') {
      window.globalThis = window;
    } else if (typeof global !== 'undefined') {
      global.globalThis = global;
    } else {
      throw new Error('Unable to locate global object');
    }
  }
  
  // Server-side polyfills
  if (typeof window === 'undefined' && typeof global !== 'undefined') {
    // Mock window object
    global.window = global.window || {
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() {},
      location: { href: '', pathname: '', search: '', hash: '' },
      navigator: { userAgent: 'node' },
      document: {},
      screen: { width: 1920, height: 1080 },
      innerWidth: 1920,
      innerHeight: 1080,
      devicePixelRatio: 1,
      requestAnimationFrame: function(cb) { return setTimeout(cb, 16); },
      cancelAnimationFrame: function(id) { clearTimeout(id); },
      performance: { now: function() { return Date.now(); } },
      WebGLRenderingContext: {},
      WebGL2RenderingContext: {},
      AudioContext: function() {},
      matchMedia: function() { return { matches: false, addListener: function() {}, removeListener: function() {} }; },
    };
    
    // Mock document object
    global.document = global.document || {
      createElement: function() { return {}; },
      createElementNS: function() { return {}; },
      createTextNode: function() { return {}; },
      querySelector: function() { return null; },
      querySelectorAll: function() { return []; },
      getElementById: function() { return null; },
      getElementsByTagName: function() { return []; },
      addEventListener: function() {},
      removeEventListener: function() {},
      body: { appendChild: function() {}, removeChild: function() {}, style: {} },
      documentElement: { style: {} },
      head: { appendChild: function() {} },
    };
    
    // Define self
    global.self = global.self || global;
    
    // Mock navigator
    global.navigator = global.navigator || {
      userAgent: 'node',
      platform: 'server',
      language: 'en-US',
      languages: ['en-US'],
      onLine: true,
    };
    
    // Mock HTMLCanvasElement
    global.HTMLCanvasElement = global.HTMLCanvasElement || function() {};
    global.HTMLCanvasElement.prototype.getContext = function() { 
      return {
        fillRect: function() {},
        clearRect: function() {},
        getImageData: function() { return { data: [] }; },
        putImageData: function() {},
        createImageData: function() { return { data: [] }; },
        setTransform: function() {},
        drawImage: function() {},
        save: function() {},
        restore: function() {},
        scale: function() {},
        rotate: function() {},
        translate: function() {},
        transform: function() {},
        beginPath: function() {},
        closePath: function() {},
        moveTo: function() {},
        lineTo: function() {},
        arc: function() {},
        rect: function() {},
        fill: function() {},
        stroke: function() {},
        measureText: function() { return { width: 0 }; },
      };
    };
    
    // Mock Image
    global.Image = global.Image || function() {
      return {
        onload: null,
        onerror: null,
        src: '',
        width: 0,
        height: 0,
      };
    };
    
    // Mock performance
    global.performance = global.performance || {
      now: function() { return Date.now(); },
      timing: {},
      navigation: {},
    };
    
    // Ensure all globals reference the same object
    global.window = global;
    global.self = global;
  }
  
  // Client-side: ensure consistency
  if (typeof window !== 'undefined') {
    window.globalThis = window.globalThis || window;
    window.self = window.self || window;
  }
})();

// Export for CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = globalThis;
}
