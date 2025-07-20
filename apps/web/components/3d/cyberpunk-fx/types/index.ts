import * as THREE from 'three';

/**
 * 4D-fähige Audio-Reactive Daten
 */
export interface AudioReactiveData {
  frequency: Float32Array;
  amplitude: number;
  bass: number;
  mid: number;
  high: number;
  time: number;
}

/**
 * Shader-Parameter für 4D-Effekte (Zeit + Frequenz)
 */
export interface CyberpunkShaderUniforms {
  uTime: { value: number };
  uAudioData: { value: AudioReactiveData };
  uResolution: { value: THREE.Vector2 };
  uMouse: { value: THREE.Vector2 };
  uColorShift: { value: number };
  uGlitchIntensity: { value: number };
  uNeonIntensity: { value: number };
  uFlowSpeed: { value: number };
}

/**
 * Post-Processing Pipeline Konfiguration
 */
export interface PostProcessingConfig {
  bloom: {
    enabled: boolean;
    intensity: number;
    radius: number;
    threshold: number;
  };
  godRays: {
    enabled: boolean;
    samples: number;
    density: number;
    weight: number;
    decay: number;
  };
  chromaticAberration: {
    enabled: boolean;
    offset: THREE.Vector2;
    radialModulation: boolean;
  };
  volumetricLight: {
    enabled: boolean;
    samples: number;
    scattering: number;
    intensity: number;
  };
}

/**
 * Environment-Set Konfiguration
 */
export interface EnvironmentPreset {
  name: string;
  skybox: string | THREE.CubeTexture;
  fog: {
    enabled: boolean;
    color: THREE.Color;
    near: number;
    far: number;
  };
  lighting: {
    ambient: { color: THREE.Color; intensity: number };
    directional: { color: THREE.Color; intensity: number; position: THREE.Vector3 };
    point: Array<{ color: THREE.Color; intensity: number; position: THREE.Vector3 }>;
  };
  postProcessing: PostProcessingConfig;
}

/**
 * Scene Context State
 */
export interface SceneContextState {
  audioData: AudioReactiveData;
  time: number;
  mouse: THREE.Vector2;
  resolution: THREE.Vector2;
  currentPreset: string;
  shaderUniforms: CyberpunkShaderUniforms;
  postProcessing: PostProcessingConfig;
}

/**
 * Shader-Typen
 */
export type ShaderType =
  | 'neonWireframe'
  | 'hologramGrid'
  | 'liquidMetal'
  | 'datastreamFlow'
  | 'timeWarpNoise'
  | 'audioColorShift';

/**
 * Material Props
 */
export interface CyberpunkMaterialProps {
  type: ShaderType;
  audioReactive?: boolean;
  glitchIntensity?: number;
  neonIntensity?: number;
  flowSpeed?: number;
  colorShift?: number;
}
