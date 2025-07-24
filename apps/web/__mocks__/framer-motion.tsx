import React from 'react';

// Mock the motion components to render as regular HTML elements
const createMockComponent = (element: string) => 
  React.forwardRef((props: any, ref) => {
    const { children, ...rest } = props;
    return React.createElement(element, { ...rest, ref }, children);
  });

export const motion = {
  div: createMockComponent('div'),
  a: createMockComponent('a'),
  p: createMockComponent('p'),
  h1: createMockComponent('h1'),
  h2: createMockComponent('h2'),
  h3: createMockComponent('h3'),
  span: createMockComponent('span'),
  img: createMockComponent('img'),
  button: createMockComponent('button'),
  section: createMockComponent('section'),
  h3: createMockComponent('h3'),
  ul: createMockComponent('ul'),
  li: createMockComponent('li'),
};
