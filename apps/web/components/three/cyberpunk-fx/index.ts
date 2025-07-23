/**
 * Neon-Cyberpunk Design- & FX-System 2.0
 *
 * Globales 4D-fähiges Shader-System für React Three Fiber
 * mit Audio-Reaktivität, Volumetric Light und Post-Processing
 */

// Core Context & Types
export {
  SceneProvider,
  useSceneContext,
  useShaderUniforms,
} from './contexts/SceneContext';
export type {
  AudioReactiveData,
  CyberpunkShaderUniforms,
  PostProcessingConfig,
  EnvironmentPreset,
  SceneContextState,
  ShaderType,
  CyberpunkMaterialProps,
} from './types';

// Shader Materials & Effects
export {
  CyberpunkMaterial,
  useCyberpunkMaterial,
  CyberpunkPresets,
} from './effects/CyberpunkMaterial';

export { PostProcessingPipeline } from './effects/PostProcessingPipeline';

// Environment Presets
export {
  EnvironmentPresetComponent,
  useEnvironmentPreset,
  ENVIRONMENT_PRESETS,
} from './presets/EnvironmentPresets';

// Individual Shaders (für erweiterte Nutzung)
export {
  neonWireframeVertexShader,
  neonWireframeFragmentShader,
} from './shaders/neonWireframe.glsl';

export {
  hologramGridVertexShader,
  hologramGridFragmentShader,
} from './shaders/hologramGrid.glsl';

export {
  liquidMetalVertexShader,
  liquidMetalFragmentShader,
  datastreamFlowVertexShader,
  datastreamFlowFragmentShader,
} from './shaders/liquidMetal.glsl';

export {
  timeWarpNoiseVertexShader,
  timeWarpNoiseFragmentShader,
  audioColorShiftVertexShader,
  audioColorShiftFragmentShader,
} from './shaders/timeWarpNoise.glsl';

/**
 * Quick Start Presets für sofortigen Einsatz
 */
export const CYBERPUNK_FX_PRESETS = {
  NEON_WIREFRAME: 'neonWireframe' as const,
  HOLOGRAM_GRID: 'hologramGrid' as const,
  LIQUID_METAL: 'liquidMetal' as const,
  DATASTREAM_FLOW: 'datastreamFlow' as const,
  TIMEWARP_NOISE: 'timeWarpNoise' as const,
  AUDIO_COLOR_SHIFT: 'audioColorShift' as const,
} as const;

export const ENVIRONMENT_PRESETS_KEYS = {
  CITY_NIGHT: 'city-night' as const,
  SPACE_TUNNEL: 'space-tunnel' as const,
  RETRO_ARCADE: 'retro-arcade' as const,
} as const;
