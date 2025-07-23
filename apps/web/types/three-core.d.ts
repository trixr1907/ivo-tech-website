import * as THREE from 'three';

declare module 'three' {
  export const MathUtils: {
    clamp(value: number, min: number, max: number): number;
    lerp(start: number, end: number, alpha: number): number;
    randFloat(low: number, high: number): number;
    randFloatSpread(range: number): number;
    degToRad(degrees: number): number;
    radToDeg(radians: number): number;
    isPowerOfTwo(value: number): boolean;
  };

  export interface ColorRepresentation {
    r: number;
    g: number;
    b: number;
  }

  export interface Material {
    color?: ColorRepresentation;
    opacity?: number;
    transparent?: boolean;
    side?: THREE.Side;
    blending?: THREE.Blending;
  }

  export interface ShaderMaterial extends Material {
    uniforms: { [uniform: string]: { value: any } };
    vertexShader: string;
    fragmentShader: string;
    extensions?: {
      derivatives?: boolean;
      fragDepth?: boolean;
      drawBuffers?: boolean;
      shaderTextureLOD?: boolean;
    };
  }

  export interface MeshStandardMaterial extends Material {
    roughness: number;
    metalness: number;
    map?: THREE.Texture;
    roughnessMap?: THREE.Texture;
    metalnessMap?: THREE.Texture;
    normalMap?: THREE.Texture;
    emissive?: ColorRepresentation;
    emissiveIntensity?: number;
    emissiveMap?: THREE.Texture;
  }

  export interface MeshBasicMaterial extends Material {
    map?: THREE.Texture;
    wireframe?: boolean;
    wireframeLinewidth?: number;
  }

  export interface Points<
    TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry,
    TMaterial extends THREE.Material | THREE.Material[] = THREE.Material | THREE.Material[]
  > extends THREE.Object3D {
    geometry: TGeometry;
    material: TMaterial;
  }

  export interface Group extends THREE.Object3D {
    children: THREE.Object3D[];
    add(...objects: THREE.Object3D[]): this;
    remove(...objects: THREE.Object3D[]): this;
  }

  export interface Vector3 {
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    setScalar(scalar: number): this;
    copy(v: Vector3): this;
    add(v: Vector3): this;
    addScalar(s: number): this;
    sub(v: Vector3): this;
    subScalar(s: number): this;
    multiplyScalar(scalar: number): this;
    divideScalar(scalar: number): this;
    length(): number;
    normalize(): this;
    clone(): Vector3;
  }

  export interface Matrix4 {
    elements: Float32Array;
    set(n11: number, n12: number, n13: number, n14: number,
        n21: number, n22: number, n23: number, n24: number,
        n31: number, n32: number, n33: number, n34: number,
        n41: number, n42: number, n43: number, n44: number): this;
    identity(): this;
    copy(m: Matrix4): this;
    multiply(m: Matrix4): this;
    premultiply(m: Matrix4): this;
    multiplyMatrices(a: Matrix4, b: Matrix4): this;
    makeTranslation(x: number, y: number, z: number): this;
    makeRotationX(theta: number): this;
    makeRotationY(theta: number): this;
    makeRotationZ(theta: number): this;
    makeScale(x: number, y: number, z: number): this;
  }

  export interface Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
    set(x: number, y: number, z: number, w: number): this;
    copy(q: Quaternion): this;
    setFromEuler(euler: Euler, update?: boolean): this;
    setFromAxisAngle(axis: Vector3, angle: number): this;
    multiply(q: Quaternion): this;
    premultiply(q: Quaternion): this;
    slerp(q: Quaternion, t: number): this;
    normalize(): this;
  }

  export interface Euler {
    x: number;
    y: number;
    z: number;
    order: string;
    set(x: number, y: number, z: number, order?: string): this;
    copy(euler: Euler): this;
    setFromQuaternion(q: Quaternion, order?: string): this;
    setFromVector3(v: Vector3, order?: string): this;
  }
}

// Three.js Loader Typen
declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Object3D, LoadingManager } from 'three';

  export class GLTFLoader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: { scene: Object3D }) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (error: Error) => void
    ): void;
  }
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  import { LoadingManager } from 'three';

  export class DRACOLoader {
    constructor(manager?: LoadingManager);
    setDecoderPath(path: string): this;
    preload(): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/loaders/KTX2Loader' {
  import { LoadingManager, Texture } from 'three';

  export class KTX2Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (texture: Texture) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (error: Error) => void
    ): Texture;
    setTranscoderPath(path: string): this;
  }
}
