// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock window methods
window.scrollTo = jest.fn();

// Mock WebGL context
window.HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  canvas: {},
  drawingBufferWidth: 0,
  drawingBufferHeight: 0,
  viewport: jest.fn(),
  clearColor: jest.fn(),
  clear: jest.fn(),
  enable: jest.fn(),
  createBuffer: jest.fn(() => ({})),
  bindBuffer: jest.fn(),
  bufferData: jest.fn(),
  getProgramParameter: jest.fn(),
  createShader: jest.fn(),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  getShaderParameter: jest.fn(),
  createProgram: jest.fn(),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  useProgram: jest.fn(),
  getAttribLocation: jest.fn(),
  getUniformLocation: jest.fn(),
  enableVertexAttribArray: jest.fn(),
  vertexAttribPointer: jest.fn(),
  uniform1f: jest.fn(),
  uniform2f: jest.fn(),
  uniform3f: jest.fn(),
  uniform4f: jest.fn(),
  drawArrays: jest.fn(),
  drawElements: jest.fn()
});

// Mock requestAnimationFrame
window.requestAnimationFrame = jest.fn(callback => setTimeout(callback, 0));
window.cancelAnimationFrame = jest.fn();

// Tests to verify mocks are working
describe('Test Setup', () => {
  test('Mock IntersectionObserver is defined', () => {
    expect(window.IntersectionObserver).toBeDefined();
  });

  test('Mock ResizeObserver is defined', () => {
    expect(window.ResizeObserver).toBeDefined();
  });

  test('Mock WebGL context is working', () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    expect(gl).toBeDefined();
    expect(gl?.viewport).toBeDefined();
  });

  test('Mock requestAnimationFrame is working', () => {
    const callback = jest.fn();
    const handle = window.requestAnimationFrame(callback);
    expect(handle).toBeDefined();
    window.cancelAnimationFrame(handle);
  });
});

// Mock window.matchMedia
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
