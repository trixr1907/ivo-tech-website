import { expect } from '@jest/globals';
import 'jest-canvas-mock';
import '@testing-library/jest-dom';

// Mock window functions
if (typeof window !== 'undefined') {
  window.scrollTo = jest.fn();
  
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  window.requestAnimationFrame = jest.fn(callback => setTimeout(callback, 0));
  window.cancelAnimationFrame = jest.fn();
}

// Mock document.createElement if it doesn't exist
if (typeof document === 'undefined') {
  global.document = {
    createElement: (tag) => ({
      setAttribute: () => {},
      innerHTML: '',
      tagName: tag.toUpperCase()
    })
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
    props: { 'data-testid': 'canvas' }
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
    props: { 'data-testid': 'orbit-controls' }
  })),
  Stars: jest.fn(() => ({
    type: 'div',
    props: { 'data-testid': 'stars' }
  })),
  Environment: jest.fn(() => ({
    type: 'div',
    props: { 'data-testid': 'environment' }
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
