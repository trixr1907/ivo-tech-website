import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Object3D, Material, Mesh, Vector2, Vector3, Matrix3, Matrix4, Quaternion } from 'three';

// Re-export Three.js core types
export type { Object3D, Material, Mesh, Vector2, Vector3, Matrix3, Matrix4, Quaternion };

// Re-export loaders
export type { GLTFLoader, DRACOLoader };

// Basis Three.js Typen
export type Vec3 = [number, number, number];
export type Vec2 = [number, number];
export type Color = string | number | THREE.Color;

// Material Typen
export interface MaterialProps {
  color?: Color;
  emissive?: Color;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  transparent?: boolean;
  opacity?: number;
  wireframe?: boolean;
  side?: THREE.Side;
  depthWrite?: boolean;
  depthTest?: boolean;
  blending?: THREE.Blending;
}

export interface MaterialInstance extends THREE.Material {
  color?: THREE.Color;
  emissive?: THREE.Color;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  transparent?: boolean;
  opacity?: number;
  wireframe?: boolean;
  side?: THREE.Side;
  depthWrite?: boolean;
  depthTest?: boolean;
  blending?: THREE.Blending;
  dispose?: () => void;
}

// Mesh Typen
export interface MeshProps {
  geometry?: THREE.BufferGeometry;
  material?: MaterialInstance | MaterialInstance[];
  position?: Vec3;
  rotation?: Vec3;
  scale?: number | Vec3;
}

export interface ObjectInstance extends THREE.Object3D {
  geometry?: THREE.BufferGeometry;
  material?: MaterialInstance | MaterialInstance[];
}

// GLTF Typen
export interface GLTFResult extends GLTF {
  scenes: THREE.Scene[];
  scene: THREE.Scene;
  animations: THREE.AnimationClip[];
  cameras: THREE.Camera[];
  asset: {
    generator: string;
    version: string;
  };
}

// Event Typen
export interface ThreeEvent<T extends Event> extends THREE.Event {
  nativeEvent: T;
  point: THREE.Vector3;
  distance: number;
  intersections: THREE.Intersection[];
  stopPropagation: () => void;
  preventDefault: () => void;
  target: THREE.Object3D;
}

// Shader Typen
export interface ShaderMaterialProps extends MaterialProps {
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [uniform: string]: THREE.IUniform };
  defines?: { [define: string]: any };
  extensions?: {
    derivatives?: boolean;
    fragDepth?: boolean;
    drawBuffers?: boolean;
    shaderTextureLOD?: boolean;
  };
}

// Renderer Typen
export interface RendererProps {
  antialias?: boolean;
  alpha?: boolean;
  preserveDrawingBuffer?: boolean;
  precision?: 'highp' | 'mediump' | 'lowp';
  powerPreference?: 'high-performance' | 'low-power' | 'default';
}

// Animation Typen
export interface AnimationProps {
  clip?: THREE.AnimationClip;
  duration?: number;
  timeScale?: number;
  loop?: THREE.LoopRepeat | THREE.LoopOnce | THREE.LoopPingPong;
}

// Post-Processing Typen
export interface PostProcessingProps {
  enabled?: boolean;
  effects?: {
    bloom?: {
      enabled?: boolean;
      intensity?: number;
      threshold?: number;
      radius?: number;
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
      fade?: number;
      roughnessFade?: number;
      thickness?: number;
      ior?: number;
      maxRoughness?: number;
      maxDepthDifference?: number;
      blend?: number;
      correction?: number;
      correctionRadius?: number;
      blur?: number;
      blurKernel?: number;
      blurSharpness?: number;
    };
  };
}
