'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// Custom Shader Definitions
const NeonHologramShader = shaderMaterial(
  // Uniforms
  {
    time: 0,
    intensity: 1.0,
    frequency: 5.0,
    glowColor: new THREE.Color(0x00ffff),
    scanlineSpeed: 2.0,
    hologramOpacity: 0.8,
    noiseScale: 10.0,
    audioData: new THREE.DataTexture(
      new Uint8Array(256),
      256,
      1,
      THREE.RedFormat
    ),
    mousePosition: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    uniform float time;
    uniform float intensity;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      
      // Hologram displacement
      vec3 displaced = position;
      displaced += normal * sin(position.y * 10.0 + time * 2.0) * 0.01 * intensity;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    uniform float time;
    uniform float intensity;
    uniform float frequency;
    uniform float scanlineSpeed;
    uniform float hologramOpacity;
    uniform float noiseScale;
    uniform vec3 glowColor;
    uniform sampler2D audioData;
    uniform vec2 mousePosition;
    
    // Noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Audio-reactive frequency data
      float audioIntensity = texture2D(audioData, vec2(uv.x, 0.5)).r;
      
      // Scanlines
      float scanline = sin(uv.y * frequency * 100.0 + time * scanlineSpeed) * 0.1;
      
      // Hologram flicker
      float flicker = 0.95 + 0.05 * sin(time * 30.0 + uv.y * 50.0);
      
      // Noise
      float noiseValue = noise(uv * noiseScale + time * 0.5) * 0.1;
      
      // Mouse interaction
      float mouseDistance = distance(uv, mousePosition);
      float mouseEffect = 1.0 / (mouseDistance * 10.0 + 1.0);
      
      // Color composition
      vec3 color = glowColor;
      color += scanline;
      color *= flicker;
      color += noiseValue;
      color *= (1.0 + audioIntensity * 0.5);
      color += mouseEffect * 0.3;
      
      // Edge glow
      float edgeGlow = 1.0 - abs(dot(vNormal, normalize(vPosition)));
      color += edgeGlow * glowColor * 0.5;
      
      gl_FragColor = vec4(color, hologramOpacity * intensity);
    }
  `
);

const CyberpunkGridShader = shaderMaterial(
  // Uniforms
  {
    time: 0,
    gridScale: 20.0,
    lineWidth: 0.02,
    pulseSpeed: 3.0,
    neonColor: new THREE.Color(0xff0080),
    bgColor: new THREE.Color(0x000011),
    audioReactive: 0.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    
    uniform float time;
    uniform float gridScale;
    uniform float lineWidth;
    uniform float pulseSpeed;
    uniform float audioReactive;
    uniform vec3 neonColor;
    uniform vec3 bgColor;
    
    void main() {
      vec2 uv = vUv;
      
      // Grid pattern
      vec2 grid = abs(fract(uv * gridScale) - 0.5);
      float line = smoothstep(lineWidth, lineWidth * 0.5, min(grid.x, grid.y));
      
      // Pulse effect
      float pulse = 0.5 + 0.5 * sin(time * pulseSpeed + length(uv - 0.5) * 10.0);
      pulse *= (1.0 + audioReactive);
      
      // Color mixing
      vec3 color = mix(bgColor, neonColor, line * pulse);
      
      // Additional glow
      float glow = exp(-length(uv - 0.5) * 2.0) * 0.3;
      color += neonColor * glow * pulse;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

const LiquidMetalShader = shaderMaterial(
  // Uniforms
  {
    time: 0,
    viscosity: 1.0,
    metallic: 0.9,
    roughness: 0.1,
    flowSpeed: 1.0,
    perturbation: 0.1,
    envMap: null as THREE.Texture | null,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    uniform float time;
    uniform float perturbation;
    
    // Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      vUv = uv;
      
      // Liquid metal deformation
      vec3 deformed = position;
      float noise1 = snoise(position * 2.0 + time * 0.5) * perturbation;
      float noise2 = snoise(position * 4.0 + time * 0.3) * perturbation * 0.5;
      
      deformed += normal * (noise1 + noise2);
      
      vPosition = deformed;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 mvPosition = modelViewMatrix * vec4(deformed, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    uniform float time;
    uniform float metallic;
    uniform float roughness;
    uniform float viscosity;
    uniform samplerCube envMap;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Reflection
      vec3 reflectDir = reflect(viewDir, normal);
      vec3 envColor = textureCube(envMap, reflectDir).rgb;
      
      // Fresnel
      float fresnel = pow(1.0 - max(dot(-viewDir, normal), 0.0), 2.0);
      
      // Liquid flow effect
      float flow = sin(vPosition.y * 5.0 + time * viscosity) * 0.1 + 0.9;
      
      // Metallic color
      vec3 baseColor = vec3(0.7, 0.8, 0.9) * flow;
      vec3 metallicColor = mix(baseColor, envColor, metallic * fresnel);
      
      // Final color
      vec3 color = metallicColor;
      color += envColor * 0.2; // Additional reflection
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Extend Three.js with custom materials
extend({ NeonHologramShader, CyberpunkGridShader, LiquidMetalShader });

// TypeScript declarations
declare module '@react-three/fiber' {
  namespace JSX {
    interface IntrinsicElements {
      neonHologramShader: any;
      cyberpunkGridShader: any;
      liquidMetalShader: any;
    }
  }
}

interface ShaderConfig {
  name: string;
  material: any;
  uniforms: Record<string, any>;
  animated: boolean;
}

export function AdvancedShaderManager() {
  const { scene, gl, camera } = useThree();
  const [activeShaders, setActiveShaders] = useState<Map<string, ShaderConfig>>(
    new Map()
  );
  const shaderRefs = useRef<Map<string, THREE.ShaderMaterial>>(new Map());
  const audioAnalyser = useRef<AnalyserNode | null>(null);

  // Initialize audio analyser
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      audioAnalyser.current = analyser;
    }
  }, []);

  // Shader presets
  const shaderPresets = {
    neonHologram: {
      name: 'Neon Hologram',
      uniforms: {
        intensity: 1.0,
        frequency: 5.0,
        glowColor: new THREE.Color(0x00ffff),
        scanlineSpeed: 2.0,
        hologramOpacity: 0.8,
      },
      animated: true,
    },
    cyberpunkGrid: {
      name: 'Cyberpunk Grid',
      uniforms: {
        gridScale: 20.0,
        lineWidth: 0.02,
        pulseSpeed: 3.0,
        neonColor: new THREE.Color(0xff0080),
        bgColor: new THREE.Color(0x000011),
      },
      animated: true,
    },
    liquidMetal: {
      name: 'Liquid Metal',
      uniforms: {
        viscosity: 1.0,
        metallic: 0.9,
        roughness: 0.1,
        flowSpeed: 1.0,
        perturbation: 0.1,
      },
      animated: true,
    },
  };

  // Create shader material
  const createShaderMaterial = useCallback(
    (type: keyof typeof shaderPresets) => {
      const preset = shaderPresets[type];
      let material: THREE.ShaderMaterial;

      switch (type) {
        case 'neonHologram':
          material = new NeonHologramShader();
          break;
        case 'cyberpunkGrid':
          material = new CyberpunkGridShader();
          break;
        case 'liquidMetal':
          material = new LiquidMetalShader();
          break;
        default:
          throw new Error(`Unknown shader type: ${type}`);
      }

      // Set initial uniforms
      Object.entries(preset.uniforms).forEach(([key, value]) => {
        if (material.uniforms[key]) {
          material.uniforms[key].value = value;
        }
      });

      return material;
    },
    []
  );

  // Register shader
  const registerShader = useCallback(
    (id: string, type: keyof typeof shaderPresets) => {
      const preset = shaderPresets[type];
      const material = createShaderMaterial(type);

      shaderRefs.current.set(id, material);
      setActiveShaders(
        prev =>
          new Map(
            prev.set(id, {
              name: preset.name,
              material,
              uniforms: { ...preset.uniforms },
              animated: preset.animated,
            })
          )
      );

      return material;
    },
    [createShaderMaterial]
  );

  // Unregister shader
  const unregisterShader = useCallback((id: string) => {
    const material = shaderRefs.current.get(id);
    if (material) {
      material.dispose();
      shaderRefs.current.delete(id);
      setActiveShaders(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }
  }, []);

  // Update shader uniform
  const updateShaderUniform = useCallback(
    (id: string, uniformName: string, value: any) => {
      const material = shaderRefs.current.get(id);
      if (material && material.uniforms[uniformName]) {
        material.uniforms[uniformName].value = value;

        // Update active shaders config
        setActiveShaders(prev => {
          const newMap = new Map(prev);
          const config = newMap.get(id);
          if (config) {
            config.uniforms[uniformName] = value;
            newMap.set(id, config);
          }
          return newMap;
        });
      }
    },
    []
  );

  // Update shader from mouse position
  const updateMousePosition = useCallback((x: number, y: number) => {
    const mousePos = new THREE.Vector2(x, y);
    shaderRefs.current.forEach(material => {
      if (material.uniforms.mousePosition) {
        material.uniforms.mousePosition.value = mousePos;
      }
    });
  }, []);

  // Animation loop
  useFrame(state => {
    const time = state.clock.getElapsedTime();

    // Update audio data
    if (audioAnalyser.current) {
      const frequencyData = new Uint8Array(
        audioAnalyser.current.frequencyBinCount
      );
      audioAnalyser.current.getByteFrequencyData(frequencyData);

      const audioTexture = new THREE.DataTexture(
        frequencyData,
        frequencyData.length,
        1,
        THREE.RedFormat
      );
      audioTexture.needsUpdate = true;

      shaderRefs.current.forEach(material => {
        if (material.uniforms.audioData) {
          material.uniforms.audioData.value = audioTexture;
        }
      });
    }

    // Update time-based uniforms
    shaderRefs.current.forEach(material => {
      if (material.uniforms.time) {
        material.uniforms.time.value = time;
      }
    });
  });

  // Expose API
  const shaderAPI = {
    register: registerShader,
    unregister: unregisterShader,
    updateUniform: updateShaderUniform,
    updateMousePosition,
    getActiveShaders: () => Array.from(activeShaders.entries()),
    presets: Object.keys(shaderPresets),
  };

  // Make API globally available
  useEffect(() => {
    (window as any).AdvancedShaderManager = shaderAPI;
    return () => {
      delete (window as any).AdvancedShaderManager;
    };
  }, [shaderAPI]);

  return null; // Invisible manager component
}

// Hook for external usage
export function useAdvancedShaders() {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    const checkAPI = () => {
      if ((window as any).AdvancedShaderManager) {
        setApi((window as any).AdvancedShaderManager);
      }
    };

    checkAPI();
    const interval = setInterval(checkAPI, 100);

    return () => clearInterval(interval);
  }, []);

  return api;
}

// Export shader materials for direct use
export { NeonHologramShader, CyberpunkGridShader, LiquidMetalShader };
