import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock für window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() {},
  };
};

// Mock für window.ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = MockResizeObserver;

// Mock für requestAnimationFrame
window.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};

// Mock für cancelAnimationFrame
window.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

// Performance API Mock
if (!window.performance) {
  window.performance = {
    now: () => Date.now()
  } as Performance;
}

// Mock für Three.js WebGL Kontext
const mockWebGLContext = {
  canvas: null,
  drawingBufferWidth: 0,
  drawingBufferHeight: 0,
  getExtension: jest.fn(() => null),
  getParameter: jest.fn(() => 0),
  getShaderPrecisionFormat: jest.fn(() => ({ precision: 1 })),
  getContextAttributes: jest.fn(() => ({
    alpha: true,
    antialias: true,
    depth: true,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default',
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    stencil: true,
    desynchronized: false,
  })),
  createBuffer: jest.fn(() => ({})),
  createFramebuffer: jest.fn(() => ({})),
  createProgram: jest.fn(() => ({})),
  createShader: jest.fn(() => ({})),
  createTexture: jest.fn(() => ({})),
  bindBuffer: jest.fn(),
  bindFramebuffer: jest.fn(),
  bindTexture: jest.fn(),
  blendFunc: jest.fn(),
  clear: jest.fn(),
  clearColor: jest.fn(),
  clearDepth: jest.fn(),
  deleteBuffer: jest.fn(),
  deleteFramebuffer: jest.fn(),
  deleteProgram: jest.fn(),
  deleteShader: jest.fn(),
  deleteTexture: jest.fn(),
  disable: jest.fn(),
  enable: jest.fn(),
  finish: jest.fn(),
  flush: jest.fn(),
  framebufferTexture2D: jest.fn(),
  getAttribLocation: jest.fn(() => 0),
  getUniformLocation: jest.fn(() => ({})),
  texImage2D: jest.fn(),
  texParameteri: jest.fn(),
  useProgram: jest.fn(),
  vertexAttribPointer: jest.fn(),
  viewport: jest.fn(),
};

HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return mockWebGLContext;
  }
  return null;
});

// Mock für lokalisierte Texte
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: { [key: string]: string } = {
      'market.summary': 'Marktübersicht',
      'market.gainers': 'Gewinner',
      'market.losers': 'Verlierer',
      'market.volume': 'Handelsvolumen',
      'market.marketCap': 'Marktkapitalisierung',
      'error.loadingData': 'Fehler beim Laden der Kryptodaten',
    };
    return translations[key] || key;
  },
}));
