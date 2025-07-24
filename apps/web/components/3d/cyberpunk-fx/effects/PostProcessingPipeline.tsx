'use client';

import React from 'react';

interface ProcessConfig {
  bloom: {
    enabled: boolean;
    intensity?: number;
    luminanceThreshold?: number;
    luminanceSmoothing?: number;
  };
  chromaticAberration: {
    enabled: boolean;
    offset?: [number, number];
  };
  noise: {
    enabled: boolean;
    opacity?: number;
  };
  scanlines: {
    enabled: boolean;
    density?: number;
  };
  vignette: {
    enabled: boolean;
    darkness?: number;
    offset?: number;
  };
  glitch: {
    enabled: boolean;
    strength?: [number, number];
    mode?: number;
  };
}

interface PostProcessingPipelineProps {
  processConfig?: ProcessConfig;
  audioIntensity?: number;
}

export const PostProcessingPipeline: React.FC<
  PostProcessingPipelineProps
> = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-gray-400">
        PostProcessing-Pipeline vorübergehend deaktiviert
      </p>
    </div>
  );
};
