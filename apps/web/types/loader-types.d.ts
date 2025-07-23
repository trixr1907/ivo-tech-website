import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { Texture, LoadingManager } from 'three';

export interface LoaderOptions {
  draco?: {
    decoderPath: string;
    decoderConfig?: { [key: string]: any };
    workerLimit?: number;
  };
  ktx2?: {
    transcoderPath: string;
    workerLimit?: number;
  };
  loadingManager?: LoadingManager;
}

export interface GLTFResult extends GLTF {
  animations: THREE.AnimationClip[];
  scene: THREE.Scene;
  scenes: THREE.Scene[];
  cameras: THREE.Camera[];
  asset: {
    copyright?: string;
    generator?: string;
    version?: string;
    minVersion?: string;
    extensions?: any;
    extras?: any;
  };
}

export interface LoaderUtils {
  GLTFLoader: typeof import('three/examples/jsm/loaders/GLTFLoader').GLTFLoader;
  DRACOLoader: typeof DRACOLoader;
  KTX2Loader: typeof KTX2Loader;
  setupLoaders: (options?: LoaderOptions) => {
    gltfLoader: import('three/examples/jsm/loaders/GLTFLoader').GLTFLoader;
    dracoLoader: DRACOLoader;
    ktx2Loader: KTX2Loader;
  };
}

export interface TextureLoaderResult {
  texture: Texture;
  error?: Error;
}
