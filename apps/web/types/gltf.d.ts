declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { LoadingManager, Object3D, Loader } from 'three';

  export interface GLTF {
    scene: Object3D;
    scenes: Object3D[];
    animations: any[];
    cameras: any[];
    asset: {
      version: string;
      [key: string]: any;
    };
  }

  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(url: string, onLoad: (gltf: GLTF) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<GLTF>;
    parse(data: ArrayBuffer | string, path: string, onLoad: (gltf: GLTF) => void, onError?: (event: ErrorEvent) => void): void;
    setDRACOLoader(dracoLoader: any): GLTFLoader;
    setKTX2Loader(ktx2Loader: any): GLTFLoader;
    setRequestHeader(header: { [key: string]: string }): GLTFLoader;
  }
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  import { LoadingManager } from 'three';

  export class DRACOLoader {
    constructor(manager?: LoadingManager);
    setDecoderPath(path: string): DRACOLoader;
    setDecoderConfig(config: any): DRACOLoader;
    preload(): void;
    load(url: string, onLoad: Function, onProgress?: Function, onError?: Function): void;
  }
}

declare module 'three/examples/jsm/loaders/KTX2Loader' {
  import { LoadingManager } from 'three';

  export class KTX2Loader {
    constructor(manager?: LoadingManager);
    setTranscoderPath(path: string): KTX2Loader;
    detectSupport(renderer: WebGLRenderer): KTX2Loader;
    load(url: string, onLoad: Function, onProgress?: Function, onError?: Function): void;
  }
}
