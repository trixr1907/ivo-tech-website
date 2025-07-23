import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass';

// Extend Three.js with postprocessing classes
extend({ EffectComposer, RenderPass, ShaderPass, UnrealBloomPass, SSAOPass, SSRPass, TAARenderPass });

interface AdvancedRendererProps {
  enableFXAA?: boolean;
  enableBloom?: boolean;
  enableSSAO?: boolean;
  enableSSR?: boolean;
  enableTAA?: boolean;
  bloomSettings?: {
    strength?: number;
    radius?: number;
    threshold?: number;
  };
  ssaoSettings?: {
    kernelRadius?: number;
    minDistance?: number;
    maxDistance?: number;
  };
  ssrSettings?: {
    intensity?: number;
    exponent?: number;
    distance?: number;
    fresnel?: number;
    maxRoughness?: number;
    surfDist?: number;
    maxDepthDifference?: number;
    thickness?: number;
  };
  taaSettings?: {
    sampleLevel?: number;
    unbiased?: boolean;
  };
  onQualityChange?: (quality: 'low' | 'medium' | 'high' | 'ultra') => void;
}

const AdvancedRenderer: React.FC<AdvancedRendererProps> = ({
  enableFXAA = true,
  enableBloom = false,
  enableSSAO = false,
  enableSSR = false,
  enableTAA = false,
  bloomSettings = {},
  ssaoSettings = {},
  ssrSettings = {},
  taaSettings = {},
  onQualityChange
}) => {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer>();
  const qualityRef = useRef<'low' | 'medium' | 'high' | 'ultra'>('medium');

  // Configure renderer
  useEffect(() => {
    if (gl) {
      gl.physicallyCorrectLights = true;
      gl.outputEncoding = THREE.sRGBEncoding;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }, [gl]);

  // Initialize composer and passes
  useEffect(() => {
    if (!gl || !scene || !camera) return;

    const composer = new EffectComposer(gl);
    composerRef.current = composer;

    // Basic render pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // FXAA
    if (enableFXAA) {
      const fxaaPass = new ShaderPass(FXAAShader);
      fxaaPass.material.uniforms.resolution.value.x = 1 / size.width;
      fxaaPass.material.uniforms.resolution.value.y = 1 / size.height;
      composer.addPass(fxaaPass);
    }

    // Bloom
    if (enableBloom) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(size.width, size.height),
        bloomSettings.strength ?? 1.5,
        bloomSettings.radius ?? 0.4,
        bloomSettings.threshold ?? 0.85
      );
      composer.addPass(bloomPass);
    }

    // SSAO
    if (enableSSAO) {
      const ssaoPass = new SSAOPass(scene, camera, size.width, size.height);
      ssaoPass.kernelRadius = ssaoSettings.kernelRadius ?? 16;
      ssaoPass.minDistance = ssaoSettings.minDistance ?? 0.005;
      ssaoPass.maxDistance = ssaoSettings.maxDistance ?? 0.1;
      composer.addPass(ssaoPass);
    }

    // SSR
    if (enableSSR) {
      const ssrPass = new SSRPass({
        renderer: gl,
        scene,
        camera,
        width: size.width,
        height: size.height,
        encoding: gl.outputEncoding,
        ...ssrSettings
      });
      composer.addPass(ssrPass);
    }

    // TAA
    if (enableTAA) {
      const taaPass = new TAARenderPass(scene, camera);
      taaPass.sampleLevel = taaSettings.sampleLevel ?? 2;
      taaPass.unbiased = taaSettings.unbiased ?? true;
      composer.addPass(taaPass);
    }

    return () => {
      composer.dispose();
    };
  }, [
    gl, scene, camera, size,
    enableFXAA, enableBloom, enableSSAO, enableSSR, enableTAA,
    bloomSettings, ssaoSettings, ssrSettings, taaSettings
  ]);

  // Quality management
  const updateQuality = (quality: 'low' | 'medium' | 'high' | 'ultra') => {
    if (!gl || quality === qualityRef.current) return;

    const qualitySettings = {
      low: {
        pixelRatio: 1,
        shadowMapSize: 1024,
        ssaoKernelRadius: 8,
        bloomRadius: 0.3
      },
      medium: {
        pixelRatio: window.devicePixelRatio,
        shadowMapSize: 2048,
        ssaoKernelRadius: 16,
        bloomRadius: 0.4
      },
      high: {
        pixelRatio: window.devicePixelRatio * 1.5,
        shadowMapSize: 4096,
        ssaoKernelRadius: 32,
        bloomRadius: 0.5
      },
      ultra: {
        pixelRatio: window.devicePixelRatio * 2,
        shadowMapSize: 8192,
        ssaoKernelRadius: 64,
        bloomRadius: 0.6
      }
    };

    const settings = qualitySettings[quality];
    gl.setPixelRatio(settings.pixelRatio);
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;

    // Update shadow map size for all lights
    scene.traverse((object) => {
      if (object instanceof THREE.Light && object.shadow) {
        object.shadow.mapSize.width = settings.shadowMapSize;
        object.shadow.mapSize.height = settings.shadowMapSize;
        object.shadow.map?.dispose();
      }
    });

    qualityRef.current = quality;
    onQualityChange?.(quality);
  };

  // Render loop
  useFrame((state, delta) => {
    if (composerRef.current) {
      composerRef.current.render(delta);
    }
  }, 1);

  // Return null as this is a manager component
  return null;
};

export default AdvancedRenderer;

// Quality presets
export const qualityPresets = {
  low: {
    enableFXAA: true,
    enableBloom: false,
    enableSSAO: false,
    enableSSR: false,
    enableTAA: false
  },
  medium: {
    enableFXAA: true,
    enableBloom: true,
    enableSSAO: false,
    enableSSR: false,
    enableTAA: true,
    bloomSettings: {
      strength: 1.0,
      radius: 0.4,
      threshold: 0.85
    }
  },
  high: {
    enableFXAA: true,
    enableBloom: true,
    enableSSAO: true,
    enableSSR: false,
    enableTAA: true,
    bloomSettings: {
      strength: 1.5,
      radius: 0.5,
      threshold: 0.8
    },
    ssaoSettings: {
      kernelRadius: 32,
      minDistance: 0.005,
      maxDistance: 0.1
    }
  },
  ultra: {
    enableFXAA: true,
    enableBloom: true,
    enableSSAO: true,
    enableSSR: true,
    enableTAA: true,
    bloomSettings: {
      strength: 2.0,
      radius: 0.6,
      threshold: 0.75
    },
    ssaoSettings: {
      kernelRadius: 64,
      minDistance: 0.004,
      maxDistance: 0.12
    },
    ssrSettings: {
      intensity: 1,
      exponent: 1,
      distance: 10,
      fresnel: 0.2,
      maxRoughness: 0.9,
      surfDist: 1,
      maxDepthDifference: 10,
      thickness: 10
    }
  }
} as const;
