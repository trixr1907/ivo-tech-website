// Mock implementation for Canvas
module.exports = {
  createCanvas: () => ({
    getContext: () => ({
      measureText: () => ({ width: 0 }),
      fillText: () => {},
      clearRect: () => {},
      fillRect: () => {},
      drawImage: () => {},
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      scale: () => {},
      translate: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {}
    }),
    toDataURL: () => ''
  }),
  loadImage: () => Promise.resolve({ width: 0, height: 0 })
};
