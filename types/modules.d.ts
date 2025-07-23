declare module 'zod' {
  export interface ZodType<T = any> {
    parse(data: unknown): T;
    safeParse(data: unknown): { success: boolean; data?: T; error?: any };
  }
  
  export function z(): ZodType;
}

declare module 'react-chartjs-2' {
  import { Component } from 'react';
  
  export class Line extends Component<any> {}
  export class Bar extends Component<any> {}
  export class Pie extends Component<any> {}
}

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Object3D, LoadingManager } from 'three';
  
  export class GLTFLoader {
    constructor(manager?: LoadingManager);
    load(url: string, onLoad: (gltf: { scene: Object3D }) => void): void;
  }
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  import { LoadingManager } from 'three';
  
  export class DRACOLoader {
    constructor(manager?: LoadingManager);
    setDecoderPath(path: string): this;
  }
}

declare module 'three/examples/jsm/loaders/KTX2Loader' {
  import { LoadingManager, Texture } from 'three';
  
  export class KTX2Loader {
    constructor(manager?: LoadingManager);
    load(url: string, onLoad: (texture: Texture) => void): void;
    setTranscoderPath(path: string): this;
  }
}
