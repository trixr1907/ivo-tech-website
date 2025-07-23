import '@testing-library/jest-dom';

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

// Mock für Performance API
if (!window.performance) {
  window.performance = {
    now: () => Date.now()
  } as Performance;
}

// Mock für Canvas/WebGL
const mockContext2D = {
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn((x, y, w, h) => ({
    data: new Uint8ClampedArray(w * h * 4)
  })),
  putImageData: jest.fn(),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  scale: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
};

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
  if (contextType === '2d') return mockContext2D;
  if (contextType === 'webgl' || contextType === 'webgl2') return mockWebGLContext;
  return null;
});

// Mock für Three.js
jest.mock('three', () => ({
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    render: jest.fn(),
    domElement: document.createElement('canvas'),
    capabilities: {
      isWebGL2: true
    },
    info: {
      render: {
        frame: 0
      }
    }
  })),
  Scene: jest.fn(),
  PerspectiveCamera: jest.fn(),
  Vector2: jest.fn(),
  Color: jest.fn(),
  Mesh: jest.fn(),
  Object3D: jest.fn(),
  Group: jest.fn()
}));

// Mock für @react-three/fiber
jest.mock('@react-three/fiber', () => ({
  useThree: jest.fn(() => ({
    gl: {
      domElement: document.createElement('canvas'),
      setSize: jest.fn(),
      render: jest.fn()
    },
    scene: {},
    camera: {},
    size: { width: 1920, height: 1080 }
  })),
  useFrame: jest.fn((callback) => callback({}, 0.016)),
  Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
