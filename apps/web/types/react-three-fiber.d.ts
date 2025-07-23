import * as THREE from 'three';
import { ReactNode } from 'react';

declare module '@react-three/fiber' {
  export interface ThreeElements {
    mesh: JSX.IntrinsicElements['mesh'];
    pointLight: JSX.IntrinsicElements['pointLight'];
    ambientLight: JSX.IntrinsicElements['ambientLight'];
    perspectiveCamera: JSX.IntrinsicElements['perspectiveCamera'];
    group: JSX.IntrinsicElements['group'];
    points: JSX.IntrinsicElements['points'];
    lineSegments: JSX.IntrinsicElements['lineSegments'];
    sprite: JSX.IntrinsicElements['sprite'];
    scene: JSX.IntrinsicElements['scene'];
  }

  export interface MaterialProps {
    color?: THREE.ColorRepresentation;
    transparent?: boolean;
    opacity?: number;
    side?: THREE.Side;
    blending?: THREE.Blending;
    depthTest?: boolean;
    depthWrite?: boolean;
  }

  export interface MeshProps extends MaterialProps {
    geometry?: THREE.BufferGeometry;
    material?: THREE.Material | THREE.Material[];
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number] | number;
    castShadow?: boolean;
    receiveShadow?: boolean;
  }

  export interface Object3DProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number] | number;
    up?: [number, number, number];
    matrix?: THREE.Matrix4;
    quaternion?: THREE.Quaternion;
    layers?: THREE.Layers;
    dispose?: (() => void) | null;
  }

  export interface LightProps extends Object3DProps {
    color?: THREE.ColorRepresentation;
    intensity?: number;
    distance?: number;
    angle?: number;
    penumbra?: number;
    decay?: number;
    castShadow?: boolean;
  }

  export interface PerspectiveCameraProps extends Object3DProps {
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
    zoom?: number;
  }

  export interface OrthographicCameraProps extends Object3DProps {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    near?: number;
    far?: number;
    zoom?: number;
  }

  export interface CanvasProps {
    children: ReactNode;
    camera?: THREE.Camera;
    gl?: THREE.WebGLRenderer;
    raycaster?: THREE.Raycaster;
    scene?: THREE.Scene;
    shadows?: boolean | THREE.ShadowMapType;
    linear?: boolean;
    flat?: boolean;
    legacy?: boolean;
    orthographic?: boolean;
    frameloop?: 'always' | 'demand' | 'never';
    performance?: {
      current?: number;
      min?: number;
      max?: number;
      debounce?: number;
    };
    dpr?: number | [min: number, max: number];
    events?: any;
  }

  export interface MeshStandardMaterialProps extends MaterialProps {
    roughness?: number;
    metalness?: number;
    emissive?: THREE.ColorRepresentation;
    emissiveIntensity?: number;
    envMapIntensity?: number;
    flatShading?: boolean;
  }

  export interface ShaderMaterialProps extends MaterialProps {
    uniforms?: { [uniform: string]: { value: any } };
    vertexShader?: string;
    fragmentShader?: string;
    wireframe?: boolean;
  }

  export interface BufferGeometryProps {
    attach?: string;
    args?: any[];
    onUpdate?: (geometry: THREE.BufferGeometry) => void;
  }

  export interface MaterialNode<T> {
    material: T;
    materialProps?: Partial<T>;
  }

  export interface GeometryNode<T> {
    geometry: T;
    geometryProps?: Partial<T>;
  }

  export interface Object3DNode<T> {
    object: T;
    objectProps?: Partial<T>;
  }
}
