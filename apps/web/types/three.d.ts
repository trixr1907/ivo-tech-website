import * as THREE from 'three';

declare module 'three' {
  // Core Types
  export type Vector3 = THREE.Vector3;
  export type Matrix4 = THREE.Matrix4;
  export type Quaternion = THREE.Quaternion;
  export type Euler = THREE.Euler;
  export type Color = THREE.Color;
  export type Object3D = THREE.Object3D;
  export type Group = THREE.Group;
  export type Scene = THREE.Scene;
  export type Camera = THREE.Camera;
  export type PerspectiveCamera = THREE.PerspectiveCamera;
  export type OrthographicCamera = THREE.OrthographicCamera;
  export type WebGLRenderer = THREE.WebGLRenderer;

  // Material Types
  export type Material = THREE.Material;
  export type ShaderMaterial = THREE.ShaderMaterial;
  export type MeshBasicMaterial = THREE.MeshBasicMaterial;
  export type MeshStandardMaterial = THREE.MeshStandardMaterial;
  export type MeshPhongMaterial = THREE.MeshPhongMaterial;
  export type MeshLambertMaterial = THREE.MeshLambertMaterial;
  export type MeshNormalMaterial = THREE.MeshNormalMaterial;
  export type MeshDepthMaterial = THREE.MeshDepthMaterial;
  export type MeshDistanceMaterial = THREE.MeshDistanceMaterial;
  export type MeshMatcapMaterial = THREE.MeshMatcapMaterial;
  export type MeshPhysicalMaterial = THREE.MeshPhysicalMaterial;
  export type MeshToonMaterial = THREE.MeshToonMaterial;
  export type LineBasicMaterial = THREE.LineBasicMaterial;
  export type LineDashedMaterial = THREE.LineDashedMaterial;
  export type PointsMaterial = THREE.PointsMaterial;
  export type SpriteMaterial = THREE.SpriteMaterial;
  export type ShadowMaterial = THREE.ShadowMaterial;
  export type RawShaderMaterial = THREE.RawShaderMaterial;

  // Geometry Types
  export type BufferGeometry = THREE.BufferGeometry;
  export type PlaneGeometry = THREE.PlaneGeometry;
  export type BoxGeometry = THREE.BoxGeometry;
  export type SphereGeometry = THREE.SphereGeometry;
  export type CylinderGeometry = THREE.CylinderGeometry;
  export type ConeGeometry = THREE.ConeGeometry;
  export type CircleGeometry = THREE.CircleGeometry;
  export type RingGeometry = THREE.RingGeometry;
  export type TorusGeometry = THREE.TorusGeometry;
  export type TorusKnotGeometry = THREE.TorusKnotGeometry;
  export type DodecahedronGeometry = THREE.DodecahedronGeometry;
  export type OctahedronGeometry = THREE.OctahedronGeometry;
  export type TetrahedronGeometry = THREE.TetrahedronGeometry;
  export type IcosahedronGeometry = THREE.IcosahedronGeometry;
  export type PolyhedronGeometry = THREE.PolyhedronGeometry;
  export type TubeGeometry = THREE.TubeGeometry;
  export type ExtrudeGeometry = THREE.ExtrudeGeometry;
  export type LatheGeometry = THREE.LatheGeometry;
  export type ShapeGeometry = THREE.ShapeGeometry;

  // Buffer Types
  export type BufferAttribute = THREE.BufferAttribute;
  export type Float32BufferAttribute = THREE.Float32BufferAttribute;
  export type Float64BufferAttribute = THREE.Float64BufferAttribute;
  export type Int8BufferAttribute = THREE.Int8BufferAttribute;
  export type Int16BufferAttribute = THREE.Int16BufferAttribute;
  export type Int32BufferAttribute = THREE.Int32BufferAttribute;
  export type Uint8BufferAttribute = THREE.Uint8BufferAttribute;
  export type Uint16BufferAttribute = THREE.Uint16BufferAttribute;
  export type Uint32BufferAttribute = THREE.Uint32BufferAttribute;
  export type InstancedBufferAttribute = THREE.InstancedBufferAttribute;

  // Math Types
  export type Box3 = THREE.Box3;
  export type Sphere = THREE.Sphere;
  export type Plane = THREE.Plane;
  export type Ray = THREE.Ray;
  export type Matrix3 = THREE.Matrix3;
  export type Vector2 = THREE.Vector2;
  export type Vector4 = THREE.Vector4;

  // Other Types
  export type ColorRepresentation = THREE.ColorRepresentation;
  export type Blending = THREE.Blending;
  export type Side = THREE.Side;
  export type Texture = THREE.Texture;
  export type LoadingManager = THREE.LoadingManager;

  // Extended Interfaces
  export interface WebGLRendererParameters extends THREE.WebGLRendererParameters {
    powerPreference?: 'high-performance' | 'low-power' | 'default';
  }

  export interface ShaderMaterialParameters extends THREE.ShaderMaterialParameters {
    uniforms?: { [uniform: string]: { value: any } };
  }

  export interface MaterialParameters extends THREE.MaterialParameters {
    color?: ColorRepresentation;
    map?: Texture;
    alphaMap?: Texture;
    opacity?: number;
    transparent?: boolean;
    side?: Side;
    blending?: Blending;
  }
}

// Three.js Loader Types
declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Object3D, LoadingManager } from 'three';

  export class GLTFLoader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: { scene: Object3D }) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (error: Error) => void
    ): void;
  }
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  import { LoadingManager } from 'three';

  export class DRACOLoader {
    constructor(manager?: LoadingManager);
    setDecoderPath(path: string): this;
    preload(): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/loaders/KTX2Loader' {
  import { LoadingManager, Texture } from 'three';

  export class KTX2Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (texture: Texture) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (error: Error) => void
    ): Texture;
    setTranscoderPath(path: string): this;
  }
}
