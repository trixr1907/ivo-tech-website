// Server-side polyfills for Three.js and React Three Fiber
import * as THREE from 'three';

// Only define polyfills if we're in a non-browser environment
if (typeof window === 'undefined') {
  // Create missing browser APIs
  global.window = {
    ...global.window,
    innerWidth: 1024,
    innerHeight: 768,
    devicePixelRatio: 1,
    // Required for WebGL context
    HTMLCanvasElement: class {},
    HTMLVideoElement: class {},
    HTMLImageElement: class {},
    WebGLRenderingContext: class {},
    WebGL2RenderingContext: class {},
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
  };

  global.document = {
    ...global.document,
    createElement: (tag) => {
      if (tag === 'canvas') {
        return {
          getContext: () => null,
          style: {},
          addEventListener: () => {},
          removeEventListener: () => {},
        };
      }
      return {
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
      };
    },
  };

  global.navigator = {
    ...global.navigator,
    userAgent: 'node',
    mediaDevices: {
      getUserMedia: () => Promise.reject(new Error('getUserMedia is not implemented')),
    },
  };

  // Ensure THREE.js variables are defined
  if (!global.self) {
    global.self = global.window;
  }

  // Create dummy WebGL constants that THREE.js might look for
  const webglConstants = {
    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632,
    ARRAY_BUFFER: 34962,
    ELEMENT_ARRAY_BUFFER: 34963,
    STATIC_DRAW: 35044,
    DYNAMIC_DRAW: 35048,
    FLOAT: 5126,
    UNSIGNED_SHORT: 5123,
    TRIANGLES: 4,
    UNSIGNED_BYTE: 5121,
    COLOR_BUFFER_BIT: 16384,
    DEPTH_BUFFER_BIT: 256,
    STENCIL_BUFFER_BIT: 1024,
    TEXTURE_2D: 3553,
    TEXTURE_CUBE_MAP: 34067,
  };

  global.WebGLRenderingContext = class {
    constructor() {
      Object.assign(this, webglConstants);
    }
  };

  global.WebGL2RenderingContext = class extends global.WebGLRenderingContext {};

  // Add basic THREE.js support
  global.THREE = THREE;
}
