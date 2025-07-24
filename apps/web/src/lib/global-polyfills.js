// Server-side polyfills for browser globals
const noop = () => {}; // No-operation function
const noopObj = {}; // Empty object for non-functional properties

// Only define polyfills if we're in a non-browser environment
if (typeof window === 'undefined') {
  global.window = {
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: noop,
    requestAnimationFrame: noop,
    cancelAnimationFrame: noop,
    innerWidth: 1024,
    innerHeight: 768,
    devicePixelRatio: 1,
    ...noopObj,
  };

  global.self = global.window;

  global.document = {
    createElement: () => ({
      getContext: () => null,
      addEventListener: noop,
      removeEventListener: noop,
      ...noopObj,
    }),
    addEventListener: noop,
    removeEventListener: noop,
    ...noopObj,
  };

  global.navigator = {
    userAgent: 'node',
    ...noopObj,
  };

  // WebGL related
  global.WebGLRenderingContext = {};
  global.WebGL2RenderingContext = {};
  global.ImageData = class {};
  global.Image = class {};
  global.HTMLCanvasElement = class {};
  global.HTMLImageElement = class {};
  global.HTMLVideoElement = class {};
}
