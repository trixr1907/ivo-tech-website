import type * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

// Three.js Basis-Typen
export type Vec3 = [number, number, number];
export type Vec2 = [number, number];
export type ColorValue = string | number | THREE.Color;

// Material-Typen
export interface MaterialProps {
  color?: ColorValue;
  emissive?: ColorValue;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  transparent?: boolean;
  opacity?: number;
  wireframe?: boolean;
}

// Shader-Typen
export interface ShaderMaterialProps extends MaterialProps {
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: { [uniform: string]: THREE.IUniform };
}

// GLTF-Typen
export interface GLTFResult extends GLTF {
  nodes: { [key: string]: THREE.Object3D };
  materials: { [key: string]: THREE.Material };
}

// Renderer-Typen
export interface RendererSettings {
  antialias?: boolean;
  alpha?: boolean;
  preserveDrawingBuffer?: boolean;
  precision?: 'highp' | 'mediump' | 'lowp';
  powerPreference?: 'high-performance' | 'low-power' | 'default';
}

// Post-Processing-Typen
export interface PostProcessingSettings {
  enabled?: boolean;
  composer?: EffectComposer;
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
  };
}

// Animation-Typen
export interface AnimationProps {
  clip?: THREE.AnimationClip;
  duration?: number;
  timeScale?: number;
  loop?: THREE.LoopRepeat | THREE.LoopOnce | THREE.LoopPingPong;
}

// Erweiterungen für THREE.Material
declare module 'three' {
  interface Material {
    dispose(): void;
  }
  
  interface Mesh {
    material: Material | Material[];
    geometry: THREE.BufferGeometry;
  }
  
  interface Object3D {
    material?: Material | Material[];
    geometry?: THREE.BufferGeometry;
  }
}
