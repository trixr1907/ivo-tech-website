import React from 'react';

const createMockComponent = (element: string) => 
  React.forwardRef((props: any, ref) => {
    const { children, initial, animate, whileHover, whileInView, viewport, transition, whileTap, ...rest } = props;
    return React.createElement(element, { ...rest, ref }, children);
  });

const handler = {
  get: function(target: any, prop: string) {
    return createMockComponent(prop);
  }
};

export const motion = new Proxy({}, handler);
