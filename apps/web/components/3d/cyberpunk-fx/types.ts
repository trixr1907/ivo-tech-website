import { Vector2, Color, Vector3 } from 'three';
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
  color?: Color;
  emissive?: Color;
  opacity?: number;
  transparent?: boolean;
  wireframe?: boolean;
  wireframeLinewidth?: number;
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
  frequency: Float32Array | number[];
  waveform: Float32Array | number[];
  time: number;
  amplitude?: number;
  bass?: number;
  mid?: number;
  high?: number;
}

export interface SceneContextState {
  time: number;
  deltaTime: number;
  audioData?: AudioReactiveData;
  shaderUniforms: CyberpunkShaderUniforms;
  mouse: Vector2;
  resolution: Vector2;
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
  uTime: { value: number };
  uAudioData: { value: AudioReactiveData };
  uResolution: { value: Vector2 };
  uMouse: { value: Vector2 };
  uColorShift: { value: number };
  uGlitchIntensity: { value: number };
  uNeonIntensity: { value: number };
  uFlowSpeed: { value: number };
}
