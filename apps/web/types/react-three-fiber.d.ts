import * as THREE from 'three';
import {
  MaterialType,
  MeshStandardMaterialType,
  MeshBasicMaterialType,
  ShaderMaterialType,
  BufferGeometryType,
  MaterialParameters,
  MeshStandardMaterialParameters,
  MeshBasicMaterialParameters,
  ShaderMaterialParameters,
} from '../lib/three-utils';
import { ReactThreeFiber } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    pointLight: ReactThreeFiber.Object3DNode<
      THREE.PointLight,
      typeof THREE.PointLight
    >;
    spotLight: ReactThreeFiber.Object3DNode<
      THREE.SpotLight,
      typeof THREE.SpotLight
    >;
    directionalLight: ReactThreeFiber.Object3DNode<
      THREE.DirectionalLight,
      typeof THREE.DirectionalLight
    >;
    ambientLight: ReactThreeFiber.Object3DNode<
      THREE.AmbientLight,
      typeof THREE.AmbientLight
    >;
    group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
    scene: ReactThreeFiber.Object3DNode<THREE.Scene, typeof THREE.Scene>;
    perspectiveCamera: ReactThreeFiber.Object3DNode<
      THREE.PerspectiveCamera,
      typeof THREE.PerspectiveCamera
    >;
    orthographicCamera: ReactThreeFiber.Object3DNode<
      THREE.OrthographicCamera,
      typeof THREE.OrthographicCamera
    >;
    boxGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.BoxGeometry,
      typeof THREE.BoxGeometry
    >;
    sphereGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.SphereGeometry,
      typeof THREE.SphereGeometry
    >;
    planeGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.PlaneGeometry,
      typeof THREE.PlaneGeometry
    >;
    meshStandardMaterial: ReactThreeFiber.MaterialNode<
      MeshStandardMaterialType,
      MeshStandardMaterialParameters
    >;
    meshBasicMaterial: ReactThreeFiber.MaterialNode<
      MeshBasicMaterialType,
      MeshBasicMaterialParameters
    >;
    shaderMaterial: ReactThreeFiber.MaterialNode<
      ShaderMaterialType,
      ShaderMaterialParameters
    >;
  }

  interface MaterialNode<T extends MaterialType, P extends MaterialParameters> {
    color?: ReactThreeFiber.Color;
    transparent?: boolean;
    opacity?: number;
    side?: THREE.Side;
    fog?: boolean;
    blending?: THREE.Blending;
    depthWrite?: boolean;
    depthTest?: boolean;
  }

  interface BufferGeometryNode<T extends BufferGeometryType> {
    args?: any[];
    attach?: string;
    computeBoundsTree?: () => void;
    disposeBoundsTree?: () => void;
  }

  interface Object3DNode<T extends THREE.Object3D, P> {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number | [number, number, number];
    up?: [number, number, number];
    matrix?: THREE.Matrix4;
    quaternion?: THREE.Quaternion;
    layers?: THREE.Layers;
    dispose?: (() => void) | null;
    geometry?: BufferGeometryType;
    material?: MaterialType;
    children?: React.ReactNode;
  }

  interface Clock {
    getElapsedTime: () => number;
    getDelta: () => number;
  }

  interface RootState {
    clock: Clock;
    scene: THREE.Scene;
    camera: THREE.Camera;
    gl: THREE.WebGLRenderer;
    invalidate: () => void;
    advance: (timestamp: number, runGlobalEffects?: boolean) => void;
    legacy: boolean;
    performance: {
      current: number;
      min: number;
      max: number;
      debounce: number;
      regress: () => void;
    };
  }
}
