import * as THREE from 'three';

// Types for polyfilled elements
interface PolyfillWindow extends Window {
  innerWidth: number;
  innerHeight: number;
  devicePixelRatio: number;
  HTMLCanvasElement: typeof HTMLCanvasElement;
  HTMLVideoElement: typeof HTMLVideoElement;
  HTMLImageElement: typeof HTMLImageElement;
  WebGLRenderingContext: typeof WebGLRenderingContext;
  WebGL2RenderingContext: typeof WebGL2RenderingContext;
  requestAnimationFrame: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame: (handle: number) => void;
}

interface PolyfillDocument extends Document {
  createElement(tagName: string): HTMLElement;
}

interface PolyfillNavigator extends Navigator {
  userAgent: string;
  mediaDevices: {
    getUserMedia: () => Promise<MediaStream>;
  };
}

interface WebGLConstants {
  VERTEX_SHADER: number;
  FRAGMENT_SHADER: number;
  ARRAY_BUFFER: number;
  ELEMENT_ARRAY_BUFFER: number;
  STATIC_DRAW: number;
  DYNAMIC_DRAW: number;
  FLOAT: number;
  UNSIGNED_SHORT: number;
  TRIANGLES: number;
  UNSIGNED_BYTE: number;
  COLOR_BUFFER_BIT: number;
  DEPTH_BUFFER_BIT: number;
  STENCIL_BUFFER_BIT: number;
  TEXTURE_2D: number;
  TEXTURE_CUBE_MAP: number;
}

const noop = (): void => {};
const noopObj = {} as const;

// Only define polyfills if we're in a non-browser environment
if (typeof window === 'undefined') {
  // WebGL constants
  const webglConstants: WebGLConstants = {
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

  // Window polyfill
  (global.window as unknown as PolyfillWindow) = {
    ...((global.window as unknown as PolyfillWindow) || {}),
    innerWidth: 1024,
    innerHeight: 768,
    devicePixelRatio: 1,
    HTMLCanvasElement: class {},
    HTMLVideoElement: class {},
    HTMLImageElement: class {},
    WebGLRenderingContext: class {
      constructor() {
        Object.assign(this, webglConstants);
      }
    },
    WebGL2RenderingContext: class extends (global.WebGLRenderingContext as any) {},
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: noop,
  };

  // Document polyfill
  (global.document as unknown as PolyfillDocument) = {
    ...((global.document as unknown as PolyfillDocument) || {}),
    createElement: (tag: string): HTMLElement => {
      if (tag === 'canvas') {
        return {
          getContext: () => null,
          style: {},
          addEventListener: noop,
          removeEventListener: noop,
        } as unknown as HTMLElement;
      }
      return {
        style: {},
        addEventListener: noop,
        removeEventListener: noop,
      } as unknown as HTMLElement;
    },
  };

  // Navigator polyfill
  (global.navigator as unknown as PolyfillNavigator) = {
    ...((global.navigator as unknown as PolyfillNavigator) || {}),
    userAgent: 'node',
    mediaDevices: {
      getUserMedia: () =>
        Promise.reject(new Error('getUserMedia is not implemented')),
    },
  };

  // Ensure THREE.js variables are defined
  if (!global.self) {
    global.self = global.window;
  }

  // Add basic THREE.js support
  (global as any).THREE = THREE;
}
