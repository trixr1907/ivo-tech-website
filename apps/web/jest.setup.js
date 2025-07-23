// Import required packages
require('jest-canvas-mock');
require('@testing-library/jest-dom');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.devicePixelRatio
Object.defineProperty(window, 'devicePixelRatio', {
  value: 1,
  writable: true
});

// Mock animation frame functions
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock WebGL
global.WebGL = {
  isWebGLAvailable: () => true,
  isWebGL2Available: () => true,
};

// Mock document.createElement if it doesn't exist
if (typeof document === 'undefined') {
  global.document = {
    createElement: tag => ({
      setAttribute: () => {},
      innerHTML: '',
      tagName: tag.toUpperCase(),
    }),
  };
}

// Create a mock canvas element
const mockCanvas = {
  setAttribute: jest.fn(),
  getContext: jest.fn(() => ({
    getImageData: jest.fn(),
    putImageData: jest.fn(),
    drawImage: jest.fn(),
    scale: jest.fn(),
    fillRect: jest.fn(),
  })),
};

// Mock Three.js
jest.mock('three', () => {
  const mockRenderer = {
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    shadowMap: {},
    domElement: mockCanvas,
  };

  return {
    WebGLRenderer: jest.fn(() => mockRenderer),
    Scene: jest.fn(),
    PerspectiveCamera: jest.fn(),
    Vector3: jest.fn(),
    Box3: jest.fn(),
    Color: jest.fn(),
    Mesh: jest.fn(),
    MeshBasicMaterial: jest.fn(),
    MeshStandardMaterial: jest.fn(),
    BoxGeometry: jest.fn(),
    BufferGeometry: jest.fn(),
    Float32BufferAttribute: jest.fn(),
    TextureLoader: jest.fn(() => ({
      load: jest.fn(),
    })),
  };
});

// Mock React Three Fiber components
jest.mock('@react-three/fiber', () => {
  const mockCanvas = {
    type: 'div',
    props: { 'data-testid': 'canvas' },
  };

  return {
    Canvas: jest.fn(() => mockCanvas),
    useFrame: jest.fn(),
    useThree: jest.fn(() => ({
      camera: { position: { set: jest.fn() } },
      gl: { setSize: jest.fn() },
    })),
  };
});

// Mock React Three Drei components
jest.mock('@react-three/drei', () => {
  const mockComponents = {
    OrbitControls: jest.fn(() => ({
      type: 'div',
      props: { 'data-testid': 'orbit-controls' },
    })),
    Stars: jest.fn(() => ({
      type: 'div',
      props: { 'data-testid': 'stars' },
    })),
    Environment: jest.fn(() => ({
      type: 'div',
      props: { 'data-testid': 'environment' },
    })),
  };

  return mockComponents;
});

// Mock console methods
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};
