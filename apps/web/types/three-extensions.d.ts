import * as THREE from 'three';
import type { ReactThreeFiber } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface MaterialNode<T extends THREE.Material, P> {
    args?: P[];
    children?: React.ReactNode;
    key?: React.Key;
    ref?: React.Ref<T>;
    attach?: string;
    attachArray?: string;
    attachObject?: [string, string];

    // Material common props
    alphaTest?: number;
    blending?: THREE.Blending;
    clipIntersection?: boolean;
    clipShadows?: boolean;
    colorWrite?: boolean;
    depthFunc?: THREE.DepthModes;
    depthTest?: boolean;
    depthWrite?: boolean;
    fog?: boolean;
    opacity?: number;
    side?: THREE.Side;
    transparent?: boolean;
    vertexColors?: boolean;
    visible?: boolean;

    // Extended material props
    color?: THREE.ColorRepresentation;
    emissive?: THREE.ColorRepresentation;
    emissiveIntensity?: number;
    metalness?: number;
    roughness?: number;
    wireframe?: boolean;
  }
}

declare module 'three' {
  interface ShaderMaterial {
    uniforms: { [uniform: string]: THREE.IUniform };
  }

  interface Material {
    defines?: { [key: string]: any };
    userData?: { [key: string]: any };
  }

  interface MeshStandardMaterialParameters {
    color?: THREE.ColorRepresentation;
    roughness?: number;
    metalness?: number;
    emissive?: THREE.ColorRepresentation;
    emissiveIntensity?: number;
  }

  interface MeshBasicMaterialParameters {
    color?: THREE.ColorRepresentation;
    opacity?: number;
    transparent?: boolean;
  }

  interface ShaderMaterialParameters {
    uniforms?: { [uniform: string]: THREE.IUniform };
    vertexShader?: string;
    fragmentShader?: string;
    defines?: { [key: string]: any };
  }

  interface WebGLRendererParameters {
    powerPreference?: 'high-performance' | 'low-power' | 'default';
  }

  interface BufferGeometry {
    attributes: { [name: string]: THREE.BufferAttribute };
    morphAttributes: { [name: string]: THREE.BufferAttribute[] };
  }

  interface Object3D {
    material?: Material | Material[];
    geometry?: BufferGeometry;
    children: Object3D[];
    parent: Object3D | null;
    up: THREE.Vector3;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    quaternion: THREE.Quaternion;
    scale: THREE.Vector3;
    matrix: THREE.Matrix4;
    matrixWorld: THREE.Matrix4;
    layers: THREE.Layers;
    visible: boolean;
    castShadow: boolean;
    receiveShadow: boolean;
    frustumCulled: boolean;
    renderOrder: number;
  }
}
