'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction, KernelSize, Resolution, ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { useSceneContext } from '../contexts/SceneContext';
import { PostProcessingConfig } from '../types';

/**
 * Custom God Rays Shader
 */
const GodRaysShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uSamples: { value: 60 },
    uDensity: { value: 0.96 },
    uWeight: { value: 0.4 },
    uDecay: { value: 0.92 },
    uLightPosition: { value: new THREE.Vector2(0.5, 0.5) },
    uIntensity: { value: 1.0 },
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform int uSamples;
    uniform float uDensity;
    uniform float uWeight;
    uniform float uDecay;
    uniform vec2 uLightPosition;
    uniform float uIntensity;
    
    varying vec2 vUv;
    
    void main() {
      vec2 texCoord = vUv;
      vec2 deltaTextCoord = vec2(texCoord - uLightPosition);
      deltaTextCoord *= 1.0 / float(uSamples) * uDensity;
      
      vec4 color = texture2D(tDiffuse, texCoord);
      float illuminationDecay = 1.0;
      
      for(int i = 0; i < 100; i++) {
        if(i >= uSamples) break;
        
        texCoord -= deltaTextCoord;
        vec4 sample = texture2D(tDiffuse, texCoord);
        sample *= illuminationDecay * uWeight;
        color += sample;
        illuminationDecay *= uDecay;
      }
      
      gl_FragColor = color * uIntensity;
    }
  `,
};

/**
 * Custom Volumetric Light Shader
 */
const VolumetricLightShader = {
  uniforms: {
    tDiffuse: { value: null },
    tDepth: { value: null },
    uTime: { value: 0 },
    uSamples: { value: 64 },
    uScattering: { value: 0.1 },
    uIntensity: { value: 0.8 },
    uLightDirection: { value: new THREE.Vector3(0.5, 0.5, -1.0) },
    uCameraPosition: { value: new THREE.Vector3() },
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform float uTime;
    uniform int uSamples;
    uniform float uScattering;
    uniform float uIntensity;
    uniform vec3 uLightDirection;
    uniform vec3 uCameraPosition;
    
    varying vec2 vUv;
    
    // Noise für Volumetric Scattering
    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
    }
    
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for(int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float depth = texture2D(tDepth, vUv).r;
      
      // Ray-marching für volumetrisches Licht
      vec3 rayDir = normalize(vec3((vUv - 0.5) * 2.0, -1.0));
      vec3 rayPos = uCameraPosition;
      
      float stepSize = 0.1;
      float volumetricLight = 0.0;
      
      for(int i = 0; i < 32; i++) {
        if(i >= uSamples) break;
        
        rayPos += rayDir * stepSize;
        
        // Volumetric Scattering berechnen
        float density = fbm(rayPos * 0.5 + uTime * 0.1) * uScattering;
        float lightContrib = max(0.0, dot(normalize(rayPos), -uLightDirection));
        
        volumetricLight += density * lightContrib * stepSize;
      }
      
      vec3 volumetricColor = vec3(0.5, 0.8, 1.0) * volumetricLight * uIntensity;
      color.rgb += volumetricColor;
      
      gl_FragColor = color;
    }
  `,
};

// Shader-Klassen definieren (ohne extend)
const GodRaysShaderImpl = GodRaysShader;
const VolumetricLightShaderImpl = VolumetricLightShader;

interface PostProcessingPipelineProps {
  config?: Partial<PostProcessingConfig>;
  enabled?: boolean;
}

/**
 * Post-Processing Pipeline Component
 */
export function PostProcessingPipeline({ config, enabled = true }: PostProcessingPipelineProps) {
  const sceneContext = useSceneContext();
  const godRaysRef = useRef<THREE.ShaderMaterial>(null);
  const volumetricRef = useRef<THREE.ShaderMaterial>(null);

  // Konfiguration mit Defaults mergen
  const processConfig = useMemo(
    () => ({
      ...sceneContext.postProcessing,
      ...config,
    }),
    [sceneContext.postProcessing, config]
  );

  // Audio-reactive Parameter
  const audioReactiveIntensity = useMemo(() => {
    const { audioData } = sceneContext;
    return 1.0 + audioData.amplitude * 0.5;
  }, [sceneContext.audioData]);

  // Frame-Updates für Custom Shader
  useFrame(state => {
    if (!enabled) return;

    const { time, mouse, audioData } = sceneContext;

    // God Rays Updates
    if (godRaysRef.current && processConfig.godRays.enabled) {
      godRaysRef.current.uniforms.uTime.value = time;
      godRaysRef.current.uniforms.uLightPosition.value.set(0.5 + mouse.x * 0.1, 0.5 + mouse.y * 0.1);
      godRaysRef.current.uniforms.uIntensity.value = processConfig.godRays.weight * audioReactiveIntensity;
    }

    // Volumetric Light Updates
    if (volumetricRef.current && processConfig.volumetricLight.enabled) {
      volumetricRef.current.uniforms.uTime.value = time;
      volumetricRef.current.uniforms.uIntensity.value =
        processConfig.volumetricLight.intensity * (1.0 + audioData.mid * 0.3);
      volumetricRef.current.uniforms.uCameraPosition.value.copy(state.camera.position);
    }
  });

  if (!enabled) return null;

  return (
    <EffectComposer>
      <React.Fragment>
        {/* Bloom Effect - Audio-reaktiv */}
        {processConfig.bloom.enabled && (
          <Bloom
            intensity={processConfig.bloom.intensity * audioReactiveIntensity}
            kernelSize={KernelSize.LARGE}
            luminanceThreshold={processConfig.bloom.threshold}
            luminanceSmoothing={processConfig.bloom.radius}
            mipmapBlur={true}
            blendFunction={BlendFunction.ADD}
          />
        )}

        {/* Chromatic Aberration - Audio-reaktiv */}
        {processConfig.chromaticAberration.enabled && (
          <ChromaticAberration
            offset={[
              processConfig.chromaticAberration.offset.x * (1.0 + sceneContext.audioData.high * 0.5),
              processConfig.chromaticAberration.offset.y * (1.0 + sceneContext.audioData.high * 0.5),
            ]}
            radialModulation={processConfig.chromaticAberration.radialModulation}
            blendFunction={BlendFunction.NORMAL}
          />
        )}

        {/* Noise für zusätzliche Cyberpunk-Atmosphäre */}
        <Noise
          premultiply
          blendFunction={BlendFunction.OVERLAY}
          opacity={0.1 + sceneContext.audioData.amplitude * 0.05}
        />

        {/* Vignette für Tiefe */}
        <Vignette offset={0.15} darkness={0.8} blendFunction={BlendFunction.MULTIPLY} />

        {/* Tone Mapping für finale Farbkorrektur */}
        <ToneMapping
          mode={ToneMappingMode.ACES_FILMIC}
          resolution={256}
          whitePoint={4.0}
          middleGrey={0.6}
          minLuminance={0.01}
          maxLuminance={16.0}
          averageLuminance={1.0}
          adaptationRate={2.0}
        />
      </React.Fragment>
    </EffectComposer>
  );
}

/**
 * Vorgefertigte Post-Processing Presets
 */
export const PostProcessingPresets = {
  /**
   * Cyberpunk City Preset
   */
  CyberpunkCity: {
    bloom: {
      enabled: true,
      intensity: 2.0,
      radius: 0.6,
      threshold: 0.1,
    },
    godRays: {
      enabled: true,
      samples: 80,
      density: 0.98,
      weight: 0.6,
      decay: 0.94,
    },
    chromaticAberration: {
      enabled: true,
      offset: new THREE.Vector2(0.003, 0.003),
      radialModulation: true,
    },
    volumetricLight: {
      enabled: true,
      samples: 64,
      scattering: 0.15,
      intensity: 1.0,
    },
  } as PostProcessingConfig,

  /**
   * Space Tunnel Preset
   */
  SpaceTunnel: {
    bloom: {
      enabled: true,
      intensity: 3.0,
      radius: 1.0,
      threshold: 0.05,
    },
    godRays: {
      enabled: true,
      samples: 100,
      density: 0.99,
      weight: 0.8,
      decay: 0.96,
    },
    chromaticAberration: {
      enabled: true,
      offset: new THREE.Vector2(0.005, 0.002),
      radialModulation: true,
    },
    volumetricLight: {
      enabled: true,
      samples: 80,
      scattering: 0.2,
      intensity: 1.2,
    },
  } as PostProcessingConfig,

  /**
   * Retro Arcade Preset
   */
  RetroArcade: {
    bloom: {
      enabled: true,
      intensity: 1.5,
      radius: 0.3,
      threshold: 0.2,
    },
    godRays: {
      enabled: false,
      samples: 40,
      density: 0.9,
      weight: 0.3,
      decay: 0.85,
    },
    chromaticAberration: {
      enabled: true,
      offset: new THREE.Vector2(0.001, 0.001),
      radialModulation: false,
    },
    volumetricLight: {
      enabled: false,
      samples: 32,
      scattering: 0.05,
      intensity: 0.5,
    },
  } as PostProcessingConfig,
};
