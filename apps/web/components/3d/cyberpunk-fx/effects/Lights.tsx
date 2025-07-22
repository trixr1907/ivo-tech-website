'use client';

import React from 'react';

interface LightProps {
  color: number;
  intensity: number;
  position?: [number, number, number];
  castShadow?: boolean;
  distance?: number;
  decay?: number;
}

interface LightsProps {
  ambient?: LightProps;
  directional?: LightProps;
  points?: LightProps[];
}

export const Lights: React.FC<LightsProps> = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-gray-400">
        Lights-Komponente vorübergehend deaktiviert
      </p>
    </div>
  );
};
