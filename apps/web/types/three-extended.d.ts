import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

declare module 'three' {
  export interface ExtendedColors<T = any> {
    color?: Color | string | number;
    emissive?: Color | string | number;
    emissiveIntensity?: number;
  }

  export interface MaterialProps extends ExtendedColors {
    transparent?: boolean;
    opacity?: number;
    metalness?: number;
    roughness?: number;
    wireframe?: boolean;
  }

  export interface StandardMaterialProps extends MaterialProps {
    map?: Texture;
    normalMap?: Texture;
    roughnessMap?: Texture;
    metalnessMap?: Texture;
    envMap?: Texture;
  }

  export interface ShaderMaterialProps extends MaterialProps {
    vertexShader?: string;
    fragmentShader?: string;
    uniforms?: { [key: string]: { value: any } };
  }

  export interface ExtendedMesh extends Mesh {
    material: Material | Material[];
    geometry: BufferGeometry;
  }

  export interface MaterialInstance extends Material {
    dispose(): void;
    needsUpdate: boolean;
    uniformsNeedUpdate: boolean;
    vertexTangentsNeedUpdate: boolean;
    vertexNormalsNeedUpdate: boolean;
    visible: boolean;
    uniforms?: { [key: string]: { value: any } };
  }

  export interface ShaderMaterialInstance extends ShaderMaterial {
    uniforms: { [key: string]: { value: any } };
  }

  export interface GLTFResult extends GLTF {
    materials?: Material[];
    animations?: AnimationClip[];
  }

  export interface ExtendedGroup extends Group {
    material?: Material | Material[];
    geometry?: BufferGeometry;
  }

  export interface ExtendedObject3D extends Object3D {
    material?: Material | Material[];
    geometry?: BufferGeometry;
  }

  export interface CyberpunkMaterialProps extends ExtendedMaterialProps {
    uniforms?: {
      uTime?: { value: number };
      uColor?: { value: Color };
      uOpacity?: { value: number };
      uAudioAmplitude?: { value: number };
      uAudioBass?: { value: number };
      uAudioMid?: { value: number };
      uAudioHigh?: { value: number };
    };
  }

  export interface CyberpunkMaterialInstance extends ShaderMaterialInstance {
    uniforms: {
      uTime: { value: number };
      uColor: { value: Color };
      uOpacity: { value: number };
      uAudioAmplitude?: { value: number };
      uAudioBass?: { value: number };
      uAudioMid?: { value: number };
      uAudioHigh?: { value: number };
    };
  }
  
  // Loaders Types
  declare module 'three/examples/jsm/loaders/GLTFLoader' {
    export class GLTFLoader {
      constructor(manager?: LoadingManager);
      load(
        url: string,
        onLoad: (gltf: GLTFResult) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (error: Error) => void
      ): void;
      setPath(path: string): GLTFLoader;
      setResourcePath(path: string): GLTFLoader;
      setDRACOLoader(dracoLoader: DRACOLoader): GLTFLoader;
    }
  }

  declare module 'three/examples/jsm/loaders/DRACOLoader' {
    export class DRACOLoader {
      constructor(manager?: LoadingManager);
      setDecoderPath(path: string): DRACOLoader;
      setDecoderConfig(config: object): DRACOLoader;
      preload(): Promise<void>;
      dispose(): void;
    }
  }

  declare module 'three/examples/jsm/loaders/KTX2Loader' {
    export class KTX2Loader {
      constructor(manager?: LoadingManager);
      load(
        url: string,
        onLoad?: (texture: Texture) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (error: Error) => void
      ): Promise<Texture>;
      setTranscoderPath(path: string): KTX2Loader;
      detectSupport(renderer: WebGLRenderer): KTX2Loader;
    }
  }

  declare module 'three/examples/jsm/postprocessing/EffectComposer' {
    export class EffectComposer {
      constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
      addPass(pass: any): void;
      removePass(pass: any): void;
      render(deltaTime?: number): void;
      reset(): void;
      dispose(): void;
    }
  }

  declare module 'three/examples/jsm/controls/OrbitControls' {
    export class OrbitControls {
      constructor(object: Camera, domElement?: HTMLElement);
      enabled: boolean;
      target: Vector3;
      minDistance: number;
      maxDistance: number;
      minZoom: number;
      maxZoom: number;
      minPolarAngle: number;
      maxPolarAngle: number;
      minAzimuthAngle: number;
      maxAzimuthAngle: number;
      enableDamping: boolean;
      dampingFactor: number;
      enableZoom: boolean;
      zoomSpeed: number;
      enableRotate: boolean;
      rotateSpeed: number;
      enablePan: boolean;
      panSpeed: number;
      screenSpacePanning: boolean;
      keyPanSpeed: number;
      autoRotate: boolean;
      autoRotateSpeed: number;
      enableKeys: boolean;
      keys: { LEFT: number; UP: number; RIGHT: number; BOTTOM: number };
      mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };
      touches: { ONE: TOUCH; TWO: TOUCH };
      update(): boolean;
      reset(): void;
      dispose(): void;
      getPolarAngle(): number;
      getAzimuthalAngle(): number;
      saveState(): void;
      reset(): void;
    }
  }
}
