'use client';

import { useMemo } from 'react';
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface EffectsProps {
  enableBloom?: boolean;
  enableGlow?: boolean;
  bloomStrength?: number;
  bloomRadius?: number;
  glowStrength?: number;
  fxaa?: boolean;
}

export function Effects({
  enableBloom = true,
  enableGlow = true,
  bloomStrength = 0.5,
  bloomRadius = 0.4,
  glowStrength = 0.3,
  fxaa = true,
}: EffectsProps) {
  // Optimierte Bloom-Einstellungen
  const bloomConfig = useMemo(
    () => ({
      luminanceThreshold: 0.8,
      luminanceSmoothing: 0.5,
      intensity: bloomStrength,
      radius: bloomRadius,
      mipmapBlur: true,
    }),
    [bloomStrength, bloomRadius]
  );

  // Kein EffectComposer rendern, wenn keine Effekte aktiviert sind
  if (!enableBloom && !enableGlow && !fxaa) {
    return null;
  }

  return (
    <EffectComposer multisampling={0} autoClear={false}>
      {/* Anti-Aliasing */}
      {fxaa && <SMAA />}

      {/* Bloom und Glow Effekte */}
      {(enableBloom || enableGlow) && (
        <Bloom
          {...bloomConfig}
          blendFunction={
            enableGlow ? BlendFunction.ADD : BlendFunction.SCREEN
          }
          opacity={glowStrength}
        />
      )}
    </EffectComposer>
  );
}

export default Effects;
