import * as THREE from 'three';

declare module 'three' {
  export interface WebGLRendererParameters {
    powerPreference?: 'high-performance' | 'low-power' | 'default';
  }

  export interface Object3D {
    material?: Material | Material[];
    geometry?: BufferGeometry;
  }

  export interface ShaderMaterial {
    uniforms: { [uniform: string]: { value: any } };
    vertexShader: string;
    fragmentShader: string;
  }

  export interface Points<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material | Material[] = Material | Material[]
  > extends Object3D {
    geometry: TGeometry;
    material: TMaterial;
  }

  export interface Mesh<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material | Material[] = Material | Material[]
  > extends Object3D {
    geometry: TGeometry;
    material: TMaterial;
  }
}

// React Three Fiber spezifische Typen
export interface ThreeElements {
  mesh: JSX.IntrinsicElements['mesh'];
  points: JSX.IntrinsicElements['points'];
  group: JSX.IntrinsicElements['group'];
  // Weitere Three.js Element-Typen hier hinzufügen
}
