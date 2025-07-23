import { ReactNode, RefObject, MutableRefObject } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// React erweiterte Typen
declare module 'react' {
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
  }

  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
}

// Three.js Basis-Typen
declare namespace THREE {
  export interface Object3DEventMap {
    [key: string]: any;
  }

  export interface Material {
    dispose(): void;
    needsUpdate: boolean;
  }

  export interface BufferGeometry {
    dispose(): void;
  }

  export interface Texture {
    dispose(): void;
  }
}

export {};
