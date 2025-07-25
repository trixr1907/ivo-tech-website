import '@testing-library/jest-dom';

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.HTMLCanvasElement.prototype.getContext = () => ({});

const { expect } = require('@jest/globals');
require('@testing-library/jest-dom');

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

jest.mock('three', () => ({
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
  })),
  PerspectiveCamera: jest.fn(),
  Scene: jest.fn(),
  BoxGeometry: jest.fn(),
  MeshStandardMaterial: jest.fn(),
  Mesh: jest.fn(),
}));

// Mock React Three Fiber components without using React.createElement
jest.mock('@react-three/fiber', () => ({
  Canvas: jest.fn(() => ({
    type: 'div',
    props: { 'data-testid': 'canvas' },
  })),
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    camera: { position: { set: jest.fn() } },
    gl: { setSize: jest.fn() },
  })),
}));

// Mock React Three Drei components without using React.createElement
jest.mock('@react-three/drei', () => ({
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
}));

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};
