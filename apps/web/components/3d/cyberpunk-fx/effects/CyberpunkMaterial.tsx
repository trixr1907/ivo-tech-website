'use client';

import React, { useMemo, useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneContext } from '../contexts/SceneContext';
import { CyberpunkMaterialProps, ShaderType } from '../types';

// Shader Imports
import {
  neonWireframeVertexShader,
  neonWireframeFragmentShader,
} from '../shaders/neonWireframe.glsl';

import {
  hologramGridVertexShader,
  hologramGridFragmentShader,
} from '../shaders/hologramGrid.glsl';

import {
  liquidMetalVertexShader,
  liquidMetalFragmentShader,
  datastreamFlowVertexShader,
  datastreamFlowFragmentShader,
} from '../shaders/liquidMetal.glsl';

import {
  timeWarpNoiseVertexShader,
  timeWarpNoiseFragmentShader,
  audioColorShiftVertexShader,
  audioColorShiftFragmentShader,
} from '../shaders/timeWarpNoise.glsl';

/**
 * Shader-Definitionsmapping
 */
const SHADER_DEFINITIONS: Record<string, { vertex: string; fragment: string }> =
  {
    neonWireframe: {
      vertex: neonWireframeVertexShader,
      fragment: neonWireframeFragmentShader,
    },
    hologramGrid: {
      vertex: hologramGridVertexShader,
      fragment: hologramGridFragmentShader,
    },
    liquidMetal: {
      vertex: liquidMetalVertexShader,
      fragment: liquidMetalFragmentShader,
    },
    datastreamFlow: {
      vertex: datastreamFlowVertexShader,
      fragment: datastreamFlowFragmentShader,
    },
    timeWarpNoise: {
      vertex: timeWarpNoiseVertexShader,
      fragment: timeWarpNoiseFragmentShader,
    },
    audioColorShift: {
      vertex: audioColorShiftVertexShader,
      fragment: audioColorShiftFragmentShader,
    },
  };

interface CyberpunkMaterialInstance extends THREE.ShaderMaterial {
  userData: {
    type: ShaderType;
    audioReactive: boolean;
  };
  side: number;
  blending: number;
  depthWrite: boolean;
}

/**
 * CyberpunkMaterial Component
 */
export const CyberpunkMaterial = forwardRef<
  THREE.ShaderMaterial,
  CyberpunkMaterialProps
>(
  (
    {
      type,
      audioReactive = true,
      glitchIntensity = 0.5,
      neonIntensity = 1.0,
      flowSpeed = 1.0,
      colorShift = 0.0,
      ...props
    },
    ref
  ) => {
    const sceneContext = useSceneContext();
    const materialRef = useRef<CyberpunkMaterialInstance>(null);

    // Shader Material erstellen
    const shaderMaterial = useMemo(() => {
      const shaderDef = SHADER_DEFINITIONS[type];
      if (!shaderDef) {
        console.warn(`Unbekannter Shader-Typ: ${type}`);
        return null;
      }

      const uniforms = {
        // Basis 4D-Uniforms
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
        uMouse: { value: new THREE.Vector2() },

        // Cyberpunk-spezifische Uniforms
        uNeonIntensity: { value: neonIntensity },
        uColorShift: { value: colorShift },
        uGlitchIntensity: { value: glitchIntensity },
        uFlowSpeed: { value: flowSpeed },

        // Audio-Reactive Uniforms (falls benötigt)
        ...(audioReactive && {
          uAudioAmplitude: { value: 0 },
          uAudioBass: { value: 0 },
          uAudioMid: { value: 0 },
          uAudioHigh: { value: 0 },
        }),
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: shaderDef.vertex,
        fragmentShader: shaderDef.fragment,
        transparent: true,
        ...props,
      }) as CyberpunkMaterialInstance;

      material.side = THREE.DoubleSide;
      material.blending = THREE.AdditiveBlending;
      material.depthWrite = false;

      // Metadata für spätere Referenz
      material.userData = {
        type,
        audioReactive,
      };

      return material;
    }, [
      type,
      audioReactive,
      neonIntensity,
      colorShift,
      glitchIntensity,
      flowSpeed,
    ]);

    // Frame-Update für Uniforms
    useFrame(state => {
      if (!shaderMaterial || !materialRef.current) return;

      const material = materialRef.current;
      const { shaderUniforms, audioData, time, mouse, resolution } =
        sceneContext;

      // Basis-Uniforms aktualisieren
      material.uniforms.uTime.value = time;
      material.uniforms.uResolution.value.copy(resolution);
      material.uniforms.uMouse.value.copy(mouse);

      // Dynamische Parameter aus SceneContext
      material.uniforms.uNeonIntensity.value =
        neonIntensity * shaderUniforms.uNeonIntensity.value;
      material.uniforms.uColorShift.value =
        colorShift + shaderUniforms.uColorShift.value;
      material.uniforms.uGlitchIntensity.value =
        glitchIntensity * shaderUniforms.uGlitchIntensity.value;
      material.uniforms.uFlowSpeed.value =
        flowSpeed * shaderUniforms.uFlowSpeed.value;

      // Audio-Reactive Updates
      if (audioReactive && material.uniforms.uAudioAmplitude && audioData) {
        material.uniforms.uAudioAmplitude.value = audioData.amplitude;
        material.uniforms.uAudioBass.value = audioData.bass;
        material.uniforms.uAudioMid.value = audioData.mid;
        material.uniforms.uAudioHigh.value = audioData.high;
      }
    });

    // Ref forwarding
    React.useImperativeHandle(ref, () => materialRef.current!, []);

    if (!shaderMaterial) return null;

    return <primitive ref={materialRef} object={shaderMaterial} />;
  }
);

CyberpunkMaterial.displayName = 'CyberpunkMaterial';

/**
 * Hook für einfache Material-Erstellung
 */
export function useCyberpunkMaterial(props: CyberpunkMaterialProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  return {
    material: materialRef.current,
    materialRef,
    Material: () => <CyberpunkMaterial ref={materialRef} {...props} />,
  };
}

/**
 * Vorgefertigte Material-Presets
 */
export const CyberpunkPresets = {
  NeonWireframe: (props?: Partial<CyberpunkMaterialProps>) => (
    <CyberpunkMaterial
      type="neonWireframe"
      audioReactive={true}
      neonIntensity={1.2}
      glitchIntensity={0.3}
      {...props}
    />
  ),

  HologramGrid: (props?: Partial<CyberpunkMaterialProps>) => (
    <CyberpunkMaterial
      type="hologramGrid"
      audioReactive={true}
      neonIntensity={0.8}
      flowSpeed={1.5}
      {...props}
    />
  ),

  LiquidMetal: (props?: Partial<CyberpunkMaterialProps>) => (
    <CyberpunkMaterial
      type="liquidMetal"
      audioReactive={false}
      neonIntensity={1.0}
      flowSpeed={0.7}
      {...props}
    />
  ),

  DatastreamFlow: (props?: Partial<CyberpunkMaterialProps>) => (
    <CyberpunkMaterial
      type="datastreamFlow"
      audioReactive={true}
      neonIntensity={1.5}
      flowSpeed={2.0}
      {...props}
    />
  ),

  TimeWarpNoise: (props?: Partial<CyberpunkMaterialProps>) => (
    <CyberpunkMaterial
      type="timeWarpNoise"
      audioReactive={true}
      neonIntensity={1.0}
      glitchIntensity={0.8}
      flowSpeed={1.2}
      {...props}
    />
  ),

  AudioColorShift: (props?: Partial<CyberpunkMaterialProps>) => (
    <CyberpunkMaterial
      type="audioColorShift"
      audioReactive={true}
      neonIntensity={1.3}
      colorShift={0.2}
      {...props}
    />
  ),
};
