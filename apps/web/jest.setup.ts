import '@testing-library/jest-dom';

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock WebGL context
HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return {
      getExtension: () => true,
      getParameter: () => {},
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      enable: () => {},
      clearColor: () => {},
      clear: () => {},
      drawArrays: () => {},
      createProgram: () => ({}),
      createShader: () => ({}),
      viewport: () => {},
      getShaderParameter: () => true,
      getShaderInfoLog: () => '',
      createTexture: () => ({}),
      bindTexture: () => {},
      texImage2D: () => {},
      texParameteri: () => {},
      useProgram: () => {},
    };
  }
  return null;
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
