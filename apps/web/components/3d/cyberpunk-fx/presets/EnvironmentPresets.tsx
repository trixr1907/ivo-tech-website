'use client';

import React from 'react';
import { EnvironmentPreset } from '../types';
import { PostProcessingPipeline } from '../effects/PostProcessingPipeline';

interface EnvironmentPresetProps {
  preset: keyof typeof ENVIRONMENT_PRESETS;
  children?: React.ReactNode;
}

export const ENVIRONMENT_PRESETS = {
  'city-night': {
    name: 'Cyberpunk City Night',
    component: () => <div>Temporär deaktiviert</div>,
    postProcessing: {},
  },
  'space-tunnel': {
    name: 'Space Tunnel',
    component: () => <div>Temporär deaktiviert</div>,
    postProcessing: {},
  },
  'retro-arcade': {
    name: 'Retro Arcade',
    component: () => <div>Temporär deaktiviert</div>,
    postProcessing: {},
  },
} as const;

export function EnvironmentPresetComponent({
  preset,
  children,
}: EnvironmentPresetProps) {
  const presetConfig = ENVIRONMENT_PRESETS[preset];

  if (!presetConfig) {
    console.warn(`Unbekanntes Environment Preset: ${preset}`);
    return <>{children}</>;
  }

  const EnvironmentComponent = presetConfig.component;

  return (
    <>
      <EnvironmentComponent />
      <PostProcessingPipeline />
      {children}
    </>
  );
}

export function useEnvironmentPreset(preset: keyof typeof ENVIRONMENT_PRESETS) {
  return {
    config: ENVIRONMENT_PRESETS[preset],
    component: ENVIRONMENT_PRESETS[preset].component,
    postProcessing: ENVIRONMENT_PRESETS[preset].postProcessing,
  };
}
