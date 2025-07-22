// Polyfills for server-side rendering

if (typeof global !== 'undefined' && !global.self) {
  global.self = global;
}

if (typeof global !== 'undefined' && !global.window) {
  global.window = global.self;
}

if (typeof global !== 'undefined' && !global.document) {
  global.document = {
    createElementNS() {
      return {};
    },
    createElement() {
      return {
        style: {},
        setAttribute() {},
        getElementsByTagName() { return []; }
      };
    }
  };
}

module.exports = {};
