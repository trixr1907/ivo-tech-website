import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ReactThreeFiber } from '@react-three/fiber';

// Re-export Three.js types
export type {
  Material,
  BufferGeometry,
  Texture,
  Color,
  Vector2,
  Vector3,
  Vector4,
  Matrix3,
  Matrix4,
  Quaternion,
  Euler,
  Mesh,
  Group,
  Scene,
  Camera,
  Light,
  Object3D,
  Renderer,
  WebGLRenderer,
  WebGLRenderTarget,
  Raycaster,
  Box3,
  Sphere,
  Plane,
  Line3,
  Triangle,
  AnimationClip,
  AnimationMixer,
  AnimationAction,
  Clock,
  LoadingManager,
  AudioListener,
  Audio,
  PositionalAudio,
  AudioAnalyser
} from 'three';

// Core Types
export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];
export type Mat3 = [number, number, number, number, number, number, number, number, number];
export type Mat4 = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
export type Quat = [number, number, number, number];
export type Euler = [number, number, number];
export type Color = string | number | THREE.Color;
export type Texture = THREE.Texture | string;

// Material Types
export interface BaseMaterialProps {
  attach?: string;
  attachArray?: string;
  attachObject?: [string, string];
  args?: any[];
  ref?: React.Ref<THREE.Material>;
  key?: React.Key;
}

export interface StandardMaterialProps extends BaseMaterialProps {
  color?: Color;
  roughness?: number;
  metalness?: number;
  map?: Texture;
  lightMap?: Texture;
  lightMapIntensity?: number;
  aoMap?: Texture;
  aoMapIntensity?: number;
  emissive?: Color;
  emissiveMap?: Texture;
  emissiveIntensity?: number;
  bumpMap?: Texture;
  bumpScale?: number;
  normalMap?: Texture;
  normalMapType?: THREE.NormalMapTypes;
  normalScale?: Vec2;
  displacementMap?: Texture;
  displacementScale?: number;
  displacementBias?: number;
  roughnessMap?: Texture;
  metalnessMap?: Texture;
  alphaMap?: Texture;
  envMap?: Texture;
  envMapIntensity?: number;
  wireframe?: boolean;
  wireframeLinewidth?: number;
  flatShading?: boolean;
}

export interface ShaderMaterialProps extends BaseMaterialProps {
  uniforms?: { [uniform: string]: THREE.IUniform };
  vertexShader?: string;
  fragmentShader?: string;
  defines?: { [key: string]: string | number | boolean };
  wireframe?: boolean;
  wireframeLinewidth?: number;
  lights?: boolean;
  clipping?: boolean;
  skinning?: boolean;
  morphTargets?: boolean;
  morphNormals?: boolean;
}

// Geometry Types
export interface BufferGeometryProps {
  attach?: string;
  args?: any[];
  ref?: React.Ref<THREE.BufferGeometry>;
  key?: React.Key;
  onUpdate?: (geometry: THREE.BufferGeometry) => void;
}

// Object Types
export interface Object3DProps {
  position?: Vec3;
  rotation?: Euler;
  scale?: Vec3 | number;
  matrix?: Mat4;
  quaternion?: Quat;
  layers?: THREE.Layers;
  up?: Vec3;
  name?: string;
  visible?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  frustumCulled?: boolean;
  renderOrder?: number;
  onUpdate?: (object: THREE.Object3D) => void;
}

// Camera Types
export interface CameraProps extends Object3DProps {
  zoom?: number;
  near?: number;
  far?: number;
  onUpdate?: (camera: THREE.Camera) => void;
}

export interface PerspectiveCameraProps extends CameraProps {
  fov?: number;
  aspect?: number;
  focus?: number;
  filmGauge?: number;
  filmOffset?: number;
}

export interface OrthographicCameraProps extends CameraProps {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

// Light Types
export interface LightProps extends Object3DProps {
  color?: Color;
  intensity?: number;
  target?: THREE.Object3D;
  shadow?: THREE.LightShadow;
}

// GLTF Types
export interface GLTFResult extends GLTF {
  nodes: { [name: string]: THREE.Object3D };
  materials: { [name: string]: THREE.Material };
  animations: THREE.AnimationClip[];
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

// Event Types
export interface ThreeEvent<T> extends Event {
  object: THREE.Object3D;
  eventObject: THREE.Object3D;
  point: THREE.Vector3;
  distance: number;
  intersections: THREE.Intersection[];
  nativeEvent: T;
}

// Renderer Types
export interface WebGLRendererProps {
  children?: React.ReactNode;
  antialias?: boolean;
  alpha?: boolean;
  pixelRatio?: number;
  width?: number;
  height?: number;
  clearColor?: Color;
  clearAlpha?: number;
  shadowMap?: {
    enabled?: boolean;
    type?: THREE.ShadowMapType;
  };
  toneMapping?: THREE.ToneMapping;
  toneMappingExposure?: number;
  outputEncoding?: THREE.TextureEncoding;
  physicallyCorrectLights?: boolean;
}

// Animation Types
export interface AnimationProps {
  clips?: THREE.AnimationClip[];
  autoplay?: boolean;
  loop?: THREE.LoopRepeat | THREE.LoopOnce | THREE.LoopPingPong;
  repetitions?: number;
  clampWhenFinished?: boolean;
  timeScale?: number;
  duration?: number;
  paused?: boolean;
  onStart?: () => void;
  onLoop?: () => void;
  onFinish?: () => void;
}

// Helper Types
export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type MaterialInstance = THREE.Material & {
  [key: string]: any;
};

export type GeometryInstance = THREE.BufferGeometry & {
  [key: string]: any;
};

export type ObjectInstance = THREE.Object3D & {
  [key: string]: any;
};

// React Three Fiber specific types
export type ExtendedColors<T> = {
  [K in NonFunctionKeys<T>]: T[K] extends THREE.Color
    ? T[K] | Color
    : T[K] extends THREE.Color | undefined
    ? T[K] | Color | undefined
    : T[K];
};

export type MaterialProps<T extends MaterialInstance = MaterialInstance> = Partial<
  ExtendedColors<T>
> &
  BaseMaterialProps;
