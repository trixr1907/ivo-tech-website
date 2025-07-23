class MockCanvas {
  getContext() {
    return {
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Uint8Array(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => ({ data: new Uint8Array(4) })),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      fillText: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
    };
  }
}

class MockOffscreenCanvas {
  getContext() {
    return {
      drawImage: jest.fn(),
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Uint8Array(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => ({ data: new Uint8Array(4) })),
      setTransform: jest.fn(),
      save: jest.fn(),
      fillText: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
    };
  }
}

global.HTMLCanvasElement.prototype.getContext = function () {
  return new MockCanvas().getContext();
};

global.OffscreenCanvas = MockOffscreenCanvas;

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
