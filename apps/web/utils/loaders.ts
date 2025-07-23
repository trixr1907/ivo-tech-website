import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { LoaderOptions, GLTFResult, LoaderUtils } from '../types/loader-types';
import { TextureLoader, LoadingManager } from 'three';

export const setupLoaders = (options?: LoaderOptions) => {
  const loadingManager = options?.loadingManager || new LoadingManager();
  
  // Initialize loaders
  const gltfLoader = new GLTFLoader(loadingManager);
  const dracoLoader = new DRACOLoader(loadingManager);
  const ktx2Loader = new KTX2Loader(loadingManager);

  // Configure DRACO loader
  if (options?.draco) {
    dracoLoader.setDecoderPath(options.draco.decoderPath);
    if (options.draco.decoderConfig) {
      dracoLoader.setDecoderConfig(options.draco.decoderConfig);
    }
    if (options.draco.workerLimit) {
      dracoLoader.setWorkerLimit(options.draco.workerLimit);
    }
    gltfLoader.setDRACOLoader(dracoLoader);
  }

  // Configure KTX2 loader
  if (options?.ktx2) {
    ktx2Loader.setTranscoderPath(options.ktx2.transcoderPath);
    if (options.ktx2.workerLimit) {
      ktx2Loader.setWorkerLimit(options.ktx2.workerLimit);
    }
    gltfLoader.setKTX2Loader(ktx2Loader);
  }

  return {
    gltfLoader,
    dracoLoader,
    ktx2Loader
  };
};

export const loadGLTF = async (url: string, options?: LoaderOptions): Promise<GLTFResult> => {
  const { gltfLoader } = setupLoaders(options);
  return await gltfLoader.loadAsync(url) as GLTFResult;
};

export const loadTexture = async (url: string, loadingManager?: LoadingManager) => {
  const textureLoader = new TextureLoader(loadingManager);
  try {
    const texture = await textureLoader.loadAsync(url);
    return { texture };
  } catch (error) {
    return { texture: null, error };
  }
};

const loaderUtils: LoaderUtils = {
  GLTFLoader,
  DRACOLoader,
  KTX2Loader,
  setupLoaders
};

export default loaderUtils;
