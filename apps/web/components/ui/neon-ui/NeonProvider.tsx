'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { NeonContextType } from './types';

const NeonContext = createContext<NeonContextType | null>(null);

interface NeonProviderProps {
  children: ReactNode;
  enableAudio?: boolean;
}

export function NeonProvider({
  children,
  enableAudio = false,
}: NeonProviderProps) {
  const [is4DMode, setIs4DMode] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode>();
  const [frequencyData, setFrequencyData] = useState<Uint8Array>();

  const toggle4DMode = async () => {
    const newMode = !is4DMode;
    setIs4DMode(newMode);

    if (newMode && enableAudio && !audioContext) {
      try {
        // Audio-Context für 4D-Modus initialisieren
        const context = new AudioContext();
        const analyser = context.createAnalyser();

        // Mikrofon-Stream anfragen
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const source = context.createMediaStreamSource(stream);

        source.connect(analyser);
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        setAudioContext(context);
        setAnalyserNode(analyser);
        setFrequencyData(dataArray);
      } catch (error) {
        console.warn('Audio-Context konnte nicht initialisiert werden:', error);
      }
    }
  };

  useEffect(() => {
    // Audio-Daten kontinuierlich aktualisieren
    if (is4DMode && analyserNode && frequencyData) {
      const updateFrequencyData = () => {
        analyserNode.getByteFrequencyData(frequencyData);
        if (is4DMode) {
          requestAnimationFrame(updateFrequencyData);
        }
      };
      updateFrequencyData();
    }
  }, [is4DMode, analyserNode, frequencyData]);

  const contextValue: NeonContextType = {
    is4DMode,
    audioContext,
    analyserNode,
    frequencyData,
    toggle4DMode,
  };

  return (
    <NeonContext.Provider value={contextValue}>{children}</NeonContext.Provider>
  );
}

export function useNeonContext(): NeonContextType {
  const context = useContext(NeonContext);
  if (!context) {
    throw new Error(
      'useNeonContext muss innerhalb eines NeonProviders verwendet werden'
    );
  }
  return context;
}
