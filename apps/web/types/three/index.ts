import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type { 
  Scene,
  Camera,
  AnimationClip,
  Material,
  Color,
  Vector2,
  Vector3,
  Matrix3,
  Matrix4,
  Quaternion,
  Mesh,
  BufferGeometry,
  DirectionalLight,
  Group,
  Texture,
  Object3D,
  Event,
  Intersection,
  Ray,
  WebGLRenderer,
  WebGLRenderTarget,
  Blending,
  Side,
  TextureLoader,
  CubeTextureLoader,
  LoadingManager,
  AnimationMixer,
  AnimationAction,
  Clock,
  Light,
  PointLight,
  AmbientLight,
  PerspectiveCamera,
  OrthographicCamera,
  Renderer,
  WebGLPowerPreference,
  ShaderMaterial,
  RawShaderMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  MeshBasicMaterial,
  BoxGeometry,
  SphereGeometry,
  PlaneGeometry,
  CylinderGeometry,
  InstancedMesh,
  Points,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  PointsMaterial
} from 'three';

// Re-export types
export type {
  Scene,
  Camera,
  WebGLRenderer,
  Material,
  Mesh,
  BufferGeometry,
  Vector2,
  Vector3,
  Matrix3,
  Matrix4,
  Quaternion,
  Color,
  Object3D,
  Texture,
  LoadingManager,
  AnimationMixer,
  AnimationAction,
  Clock,
  Light,
  DirectionalLight,
  PointLight,
  AmbientLight,
  PerspectiveCamera,
  OrthographicCamera,
  WebGLRenderTarget,
  Renderer,
  WebGLPowerPreference,
  TextureLoader,
  CubeTextureLoader,
  ShaderMaterial,
  RawShaderMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  MeshBasicMaterial,
  Group,
  BoxGeometry,
  SphereGeometry,
  PlaneGeometry,
  CylinderGeometry,
  InstancedMesh,
  Points,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  PointsMaterial
};

// Common event types
export interface ThreeEvent<T extends Event> {
  nativeEvent: T;
  point: Vector3;
  distance: number;
  intersections: Intersection[];
  stopPropagation: () => void;
  preventDefault: () => void;
  target: Object3D;
}

export interface InteractionEvent extends ThreeEvent<MouseEvent> {
  point: Vector3;
  intersections: Intersection[];
  distance: number;
  nativeEvent: MouseEvent;
}

// Common prop types
export interface MaterialProps {
  color?: string | number | Color;
  emissive?: string | number | Color;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  wireframe?: boolean;
  transparent?: boolean;
  opacity?: number;
  side?: Side;
  depthWrite?: boolean;
  depthTest?: boolean;
  blending?: Blending;
}

export interface ShaderMaterialProps extends MaterialProps {
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [uniform: string]: { value: any } };
  defines?: { [define: string]: any };
  extensions?: {
    derivatives?: boolean;
    fragDepth?: boolean;
    drawBuffers?: boolean;
    shaderTextureLOD?: boolean;
  };
}

export interface LightingProps {
  type: 'ambient' | 'directional' | 'point' | 'spot';
  color?: string | number | Color;
  intensity?: number;
  position?: [number, number, number];
  target?: Object3D;
  castShadow?: boolean;
  shadowMapSize?: number;
}

export interface ModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  material?: MaterialProps;
  animations?: {
    clipName: string;
    loop?: boolean;
    timeScale?: number;
  }[];
}

export interface GLTFResult extends GLTF {
  scenes: Scene[];
  scene: Scene;
  animations: AnimationClip[];
  cameras: Camera[];
  asset: {
    copyright?: string;
    generator?: string;
    version?: string;
    minVersion?: string;
    extensions?: any;
    extras?: any;
  };
  parser: any;
  userData: any;
}

export interface PostProcessingProps {
  enabled?: boolean;
  renderToScreen?: boolean;
  effects?: {
    bloom?: {
      enabled?: boolean;
      strength?: number;
      radius?: number;
      threshold?: number;
    };
    ssao?: {
      enabled?: boolean;
      radius?: number;
      intensity?: number;
      bias?: number;
    };
    ssr?: {
      enabled?: boolean;
      intensity?: number;
      exponent?: number;
      distance?: number;
      fresnel?: number;
    };
    fxaa?: {
      enabled?: boolean;
    };
    taa?: {
      enabled?: boolean;
      sampleLevel?: number;
    };
  };
}

// Animation types
export interface AnimationProps {
  enabled?: boolean;
  timeScale?: number;
  loop?: boolean;
  clips?: string[];
  blendMode?: 'normal' | 'additive';
  weight?: number;
  fadeIn?: number;
  fadeOut?: number;
  onStart?: () => void;
  onFinish?: () => void;
  onLoop?: () => void;
}

// Scene props
export interface SceneProps {
  children?: React.ReactNode;
  camera?: {
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
    zoom?: number;
  };
  controls?: {
    enabled?: boolean;
    enableDamping?: boolean;
    dampingFactor?: number;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    enableZoom?: boolean;
    minDistance?: number;
    maxDistance?: number;
    minPolarAngle?: number;
    maxPolarAngle?: number;
  };
  fog?: {
    color?: string | number | Color;
    near?: number;
    far?: number;
    density?: number;
  };
  environment?: string;
  shadows?: boolean;
  legacy?: boolean;
  flat?: boolean;
  linear?: boolean;
  frameloop?: 'always' | 'demand' | 'never';
  performance?: {
    current?: number;
    min?: number;
    max?: number;
    debounce?: number;
  };
  eventSource?: HTMLElement;
  eventPrefix?: string;
  onCreated?: (state: any) => void;
  onPointerMissed?: (event: MouseEvent) => void;
}

// Renderer props
export interface RendererProps {
  antialias?: boolean;
  alpha?: boolean;
  preserveDrawingBuffer?: boolean;
  precision?: 'highp' | 'mediump' | 'lowp';
  powerPreference?: WebGLPowerPreference;
  shadows?: boolean;
  shadowMapType?: number;
  toneMapping?: number;
  toneMappingExposure?: number;
  outputEncoding?: number;
  physicallyCorrectLights?: boolean;
  size?: {
    width: number;
    height: number;
  };
  pixelRatio?: number;
  vr?: boolean;
  xr?: boolean;
  gl?: WebGLRenderer;
}
