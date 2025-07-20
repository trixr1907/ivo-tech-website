import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

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

// Mock WebGL context for Three.js
const mockWebGLContext = {
  getParameter: () => 'WebGL Mock',
  getExtension: () => null,
  createProgram: () => ({}),
  createShader: () => ({}),
  shaderSource: () => {},
  compileShader: () => {},
  attachShader: () => {},
  linkProgram: () => {},
  useProgram: () => {},
  createBuffer: () => ({}),
  bindBuffer: () => {},
  bufferData: () => {},
  enableVertexAttribArray: () => {},
  vertexAttribPointer: () => {},
  drawArrays: () => {},
  drawElements: () => {},
  enable: () => {},
  disable: () => {},
  clear: () => {},
  clearColor: () => {},
  viewport: () => {},
};

HTMLCanvasElement.prototype.getContext = jest.fn(type => {
  if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
    return mockWebGLContext;
  }
  return null;
});

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '';
  },
}));

// Mock React Three Fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid='mock-canvas'>{children}</div>,
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    scene: {},
    camera: {},
    gl: { domElement: document.createElement('canvas') },
  })),
}));

// Mock React Three Drei
jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid='mock-orbit-controls' />,
  Text3D: ({ children }) => <div data-testid='mock-text-3d'>{children}</div>,
  Center: ({ children }) => <div data-testid='mock-center'>{children}</div>,
  Environment: () => <div data-testid='mock-environment' />,
  ContactShadows: () => <div data-testid='mock-contact-shadows' />,
  Float: ({ children }) => <div data-testid='mock-float'>{children}</div>,
  Sphere: () => <div data-testid='mock-sphere' />,
  Box: () => <div data-testid='mock-box' />,
  useGLTF: jest.fn(() => ({ scene: {} })),
  useTexture: jest.fn(() => ({})),
}));

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    timeline: jest.fn(() => ({
      to: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      fromTo: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      play: jest.fn().mockReturnThis(),
      pause: jest.fn().mockReturnThis(),
      reverse: jest.fn().mockReturnThis(),
      restart: jest.fn().mockReturnThis(),
      kill: jest.fn().mockReturnThis(),
    })),
    to: jest.fn(),
    from: jest.fn(),
    fromTo: jest.fn(),
    set: jest.fn(),
  },
}));

// Mock use-sound
jest.mock('use-sound', () => jest.fn(() => [jest.fn(), {}]));

// Mock Vercel Analytics
jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}));

// Mock Vercel Speed Insights
jest.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => null,
}));

// Mock axios for API tests
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Suppress console warnings during tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  // Suppress specific Three.js warnings that are not relevant for testing
  if (args[0] && typeof args[0] === 'string' && args[0].includes('THREE.')) {
    return;
  }
  originalConsoleWarn(...args);
};
