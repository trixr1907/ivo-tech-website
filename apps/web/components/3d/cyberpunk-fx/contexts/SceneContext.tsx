'use client';

import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  AudioReactiveData,
  SceneContextState,
  PostProcessingConfig,
  CyberpunkShaderUniforms,
} from '../types';

/**
 * SceneContext für globales 4D-fähiges Shader-System
 */
const SceneContext = createContext<SceneContextState | null>(null);

interface SceneProviderProps {
  children: ReactNode;
  enableAudio?: boolean;
  initialPreset?: string;
}

/**
 * Audio-Analyse Utility
 */
class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private source: AudioNode | null = null;

  async init(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      // Versuche Mikrofon-Zugriff für Echzeit-Audio-Reaktivität
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyser);
    } catch (error) {
      console.warn('Audio-Zugriff nicht verfügbar:', error);
    }
  }

  getAudioData(): AudioReactiveData {
    if (!this.analyser || !this.dataArray) {
      return {
        frequency: new Float32Array(128),
        waveform: new Float32Array(128),
        volume: 0,
        amplitude: 0,
        bass: 0,
        mid: 0,
        high: 0,
        time: performance.now() * 0.001,
      };
    }

    this.analyser.getByteFrequencyData(this.dataArray);

    const frequencyData = new Float32Array(this.dataArray.length);
    let totalAmplitude = 0;

    for (let i = 0; i < this.dataArray.length; i++) {
      frequencyData[i] = this.dataArray[i] / 255.0;
      totalAmplitude += frequencyData[i];
    }

    const amplitude = totalAmplitude / this.dataArray.length;
    const bass = this.getFrequencyRange(frequencyData, 0, 0.1);
    const mid = this.getFrequencyRange(frequencyData, 0.1, 0.5);
    const high = this.getFrequencyRange(frequencyData, 0.5, 1.0);

    // Waveform-Daten aus dem Analyser holen
    const waveformData = new Float32Array(this.dataArray.length);
    this.analyser.getByteTimeDomainData(new Uint8Array(this.dataArray.length));
    for (let i = 0; i < this.dataArray.length; i++) {
      waveformData[i] = (this.dataArray[i] - 128) / 128.0;
    }

    return {
      frequency: frequencyData,
      waveform: waveformData,
      volume: amplitude,
      amplitude,
      bass,
      mid,
      high,
      time: performance.now() * 0.001,
    };
  }

  private getFrequencyRange(
    data: Float32Array,
    start: number,
    end: number
  ): number {
    const startIndex = Math.floor(start * data.length);
    const endIndex = Math.floor(end * data.length);
    let sum = 0;

    for (let i = startIndex; i < endIndex; i++) {
      sum += data[i];
    }

    return sum / (endIndex - startIndex);
  }
}

/**
 * Default Post-Processing Konfiguration
 */
const defaultPostProcessing: PostProcessingConfig = {
  bloom: {
    enabled: true,
    intensity: 1.5,
    radius: 0.4,
    threshold: 0.1,
  },
  godRays: {
    enabled: true,
    samples: 60,
    density: 0.96,
    weight: 0.4,
    decay: 0.92,
  },
  chromaticAberration: {
    enabled: true,
    offset: new THREE.Vector2(0.002, 0.002),
    radialModulation: true,
  },
  volumetricLight: {
    enabled: true,
    samples: 64,
    scattering: 0.1,
    intensity: 0.8,
  },
};

/**
 * SceneProvider Component
 */
export function SceneProvider({
  children,
  enableAudio = true,
  initialPreset = 'city-night',
}: SceneProviderProps) {
  const { viewport, size } = useThree();
  const audioAnalyzer = useRef(new AudioAnalyzer());
  const mouseRef = useRef(new THREE.Vector2());
  const lastUpdateRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [targetFPS, setTargetFPS] = useState(60);

  const [sceneState, setSceneState] = useState<SceneContextState>(() => ({
    audioData: {
      frequency: new Float32Array(128),
      waveform: new Float32Array(128),
      volume: 0,
      amplitude: 0,
      bass: 0,
      mid: 0,
      high: 0,
      time: 0,
    },
    time: 0,
    deltaTime: 0,
    mouse: new THREE.Vector2(),
    resolution: new THREE.Vector2(size.width, size.height),
    currentPreset: initialPreset,
    shaderUniforms: {
      uTime: { value: 0 },
      uAudioData: {
        value: {
          frequency: new Float32Array(128),
          waveform: new Float32Array(128),
          volume: 0,
          amplitude: 0,
          bass: 0,
          mid: 0,
          high: 0,
          time: 0,
        },
      },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2() },
      uColorShift: { value: 0 },
      uGlitchIntensity: { value: 0 },
      uNeonIntensity: { value: 1 },
      uFlowSpeed: { value: 1 },
    },
    postProcessing: defaultPostProcessing,
  }));

  // Mobile Detection und FPS-Anpassung
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
      setIsMobile(isMobileDevice);

      // Mobile Geräte: 45 FPS für bessere Performance
      setTargetFPS(isMobileDevice ? 45 : 60);

      // Performance-Budget basierend auf Hardware
      const cores = (navigator as any).hardwareConcurrency || 4;
      const memory = (navigator as any).deviceMemory || 8;

      if (cores < 4 || memory < 4) {
        setTargetFPS(30); // Sehr schwache Hardware
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Audio-System initialisieren
  useEffect(() => {
    if (enableAudio) {
      audioAnalyzer.current.init().catch(console.warn);
    }
  }, [enableAudio]);

  // Maus-Events
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -(event.clientY / size.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  // Frame-Update mit FPS-Throttling für Mobile Geräte
  useFrame((state, delta) => {
    const now = performance.now();
    const targetFrameTime = 1000 / targetFPS;

    // FPS-Throttling: nur updaten wenn genug Zeit vergangen
    if (isMobile && now - lastUpdateRef.current < targetFrameTime) {
      return;
    }

    lastUpdateRef.current = now;

    const time = state.clock.getElapsedTime();
    const audioData = enableAudio
      ? audioAnalyzer.current.getAudioData()
      : sceneState.audioData;

    // Audio-reaktive Farb-Shifts (reduziert auf Mobil)
    const colorShiftIntensity = isMobile ? 0.3 : 0.5;
    const colorShift = audioData?.bass
      ? audioData.bass * colorShiftIntensity + Math.sin(time * 0.1) * 0.2
      : Math.sin(time * 0.1) * 0.2;
    const glitchIntensity = audioData?.amplitude
      ? audioData.amplitude * (isMobile ? 1.0 : 2.0)
      : 0;

    setSceneState(prev => ({
      ...prev,
      audioData,
      time,
      mouse: new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
      resolution: new THREE.Vector2(size.width, size.height),
      shaderUniforms: {
        uTime: { value: time },
        uAudioData: {
          value: audioData || {
            frequency: new Float32Array(128),
            waveform: new Float32Array(128),
            volume: 0,
            amplitude: 0,
            bass: 0,
            mid: 0,
            high: 0,
            time: 0,
          },
        },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uMouse: {
          value: new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        },
        uColorShift: { value: colorShift },
        uGlitchIntensity: { value: glitchIntensity },
        uNeonIntensity: {
          value: 1.0 + (audioData?.high || 0) * (isMobile ? 0.3 : 0.5),
        },
        uFlowSpeed: {
          value: 1.0 + (audioData?.mid || 0) * (isMobile ? 1.0 : 2.0),
        },
      },
    }));
  });

  return (
    <SceneContext.Provider value={sceneState}>{children}</SceneContext.Provider>
  );
}

/**
 * Hook zum Zugriff auf den SceneContext
 */
export function useSceneContext(): SceneContextState {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error(
      'useSceneContext muss innerhalb eines SceneProvider verwendet werden'
    );
  }
  return context;
}

/**
 * Hook für Shader-Uniforms
 */
export function useShaderUniforms(): CyberpunkShaderUniforms {
  const { shaderUniforms } = useSceneContext();
  return shaderUniforms;
}
