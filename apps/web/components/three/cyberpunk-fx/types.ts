import { Vector2, Color, Vector3, Material, Texture, Uniform, IUniform, WebGLRenderer, Scene, Camera, Clock } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import React from 'react';

/**
 * Gemeinsame Typen für die Cyberpunk-FX Komponenten
 */

export interface CyberpunkFXProps {
  children?: React.ReactNode;
}

export interface EnvironmentPreset {
  name: string;
  component: React.ComponentType;
  postProcessing: Record<string, unknown>;
}

export type ShaderType =
  | 'neonWireframe'
  | 'hologramGrid'
  | 'liquidMetal'
  | 'datastreamFlow'
  | 'timeWarpNoise'
  | 'audioColorShift';

export interface CyberpunkMaterialProps {
  type: ShaderType;
  audioReactive?: boolean;
  glitchIntensity?: number;
  neonIntensity?: number;
  flowSpeed?: number;
  colorShift?: number;
  color?: Color | number | string;
  emissive?: Color | number | string;
  opacity?: number;
  transparent?: boolean;
  wireframe?: boolean;
  wireframeLinewidth?: number;
  map?: Texture;
  emissiveMap?: Texture;
  normalMap?: Texture;
  roughnessMap?: Texture;
  metalnessMap?: Texture;
  alphaMap?: Texture;
  envMap?: Texture;
  side?: number;
  blending?: number;
  depthTest?: boolean;
  depthWrite?: boolean;
  fog?: boolean;
  userData?: any;
}

export interface CustomEffectProps {
  enabled?: boolean;
  blendFunction?: number;
}

export interface RenderTargetConfig {
  format?: number;
  type?: number;
  encoding?: number;
  depthBuffer?: boolean;
  stencilBuffer?: boolean;
  depthTexture?: boolean;
  samples?: number;
}

export interface AudioReactiveData {
  volume: number;
  frequency: Float32Array;
  waveform: Float32Array;
  time: number;
  amplitude: number;
  bass: number;
  mid: number;
  high: number;
  frequencyBinCount?: number;
  sampleRate?: number;
  fftSize?: number;
  minDecibels?: number;
  maxDecibels?: number;
  smoothingTimeConstant?: number;
}

export interface SceneContextState {
  time: number;
  deltaTime: number;
  audioData: AudioReactiveData;
  shaderUniforms: CyberpunkShaderUniforms;
  mouse: Vector2;
  resolution: Vector2;
  scene?: Scene;
  camera?: Camera;
  renderer?: WebGLRenderer;
  composer?: EffectComposer;
  controls?: OrbitControls;
  clock?: Clock;
  currentPreset: string;
  postProcessing: PostProcessingConfig;
  ready: boolean;
  fps?: number;
  performanceStats?: {
    drawCalls: number;
    triangles: number;
    points: number;
    lines: number;
    memoryGeometries: number;
    memoryTextures: number;
    programs: number;
  };
}

export interface PostProcessingConfig {
  bloom?: {
    enabled: boolean;
    intensity: number;
    radius: number;
    threshold: number;
  };
  godRays?: {
    enabled: boolean;
    samples: number;
    density: number;
    weight: number;
    decay: number;
  };
  chromaticAberration?: {
    enabled: boolean;
    offset: Vector2;
    radialModulation: boolean;
  };
  volumetricLight?: {
    enabled: boolean;
    samples: number;
    scattering: number;
    intensity: number;
  };
}

export interface CyberpunkShaderUniforms {
  uTime: IUniform<number>;
  uAudioData: IUniform<AudioReactiveData>;
  uResolution: IUniform<Vector2>;
  uMouse: IUniform<Vector2>;
  uColorShift: IUniform<number>;
  uGlitchIntensity: IUniform<number>;
  uNeonIntensity: IUniform<number>;
  uFlowSpeed: IUniform<number>;
  [key: string]: IUniform<any>;
}
