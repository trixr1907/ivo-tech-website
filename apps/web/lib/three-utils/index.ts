import * as THREE from 'three';

// Core Exports
export {
  BufferGeometry,
  IcosahedronGeometry,
  ConeGeometry,
  PlaneGeometry,
  BoxGeometry,
  SphereGeometry,
  TorusGeometry,
  Material,
  MeshStandardMaterial,
  MeshBasicMaterial,
  ShaderMaterial,
  PointsMaterial,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  OrthographicCamera,
  AmbientLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  Vector2,
  Vector3,
  Matrix4,
  Quaternion,
  Euler,
  Color,
  Clock,
  Object3D,
  Group,
  Mesh,
  Points,
  BufferAttribute,
  Float32BufferAttribute,
  DoubleSide,
  FrontSide,
  BackSide,
  AdditiveBlending,
  NormalBlending,
  SubtractiveBlending,
  MultiplyBlending,
  CustomBlending,
  MathUtils,
} from 'three';

// Type Exports
export type {
  Material as MaterialType,
  MeshStandardMaterial as MeshStandardMaterialType,
  MeshBasicMaterial as MeshBasicMaterialType,
  ShaderMaterial as ShaderMaterialType,
  BufferGeometry as BufferGeometryType,
  Vector3 as Vector3Type,
  Color as ColorType,
  Object3D as Object3DType,
  Group as GroupType,
  Mesh as MeshType,
  Scene as SceneType,
  Clock as ClockType,
} from 'three';

// Common Types from Three.js
export type ColorRepresentation = number | string | THREE.Color;
export type Side =
  | typeof THREE.FrontSide
  | typeof THREE.BackSide
  | typeof THREE.DoubleSide;
export type Blending =
  | typeof THREE.NormalBlending
  | typeof THREE.AdditiveBlending
  | typeof THREE.SubtractiveBlending
  | typeof THREE.MultiplyBlending
  | typeof THREE.CustomBlending;

// Material Parameter Types
export interface MaterialParameters {
  color?: ColorRepresentation;
  transparent?: boolean;
  opacity?: number;
  side?: Side;
  fog?: boolean;
  blending?: Blending;
  depthWrite?: boolean;
  depthTest?: boolean;
}

export interface MeshBasicMaterialParameters extends MaterialParameters {
  wireframe?: boolean;
  wireframeLinewidth?: number;
}

export interface MeshStandardMaterialParameters extends MaterialParameters {
  roughness?: number;
  metalness?: number;
  emissive?: ColorRepresentation;
  emissiveIntensity?: number;
  wireframe?: boolean;
  wireframeLinewidth?: number;
}

export interface ShaderMaterialParameters extends MaterialParameters {
  uniforms?: { [uniform: string]: { value: any } };
  vertexShader?: string;
  fragmentShader?: string;
}

// Type Guards
export const isMesh = (obj: any): obj is THREE.Mesh =>
  obj instanceof THREE.Mesh;
export const isGroup = (obj: any): obj is THREE.Group =>
  obj instanceof THREE.Group;
export const isObject3D = (obj: any): obj is THREE.Object3D =>
  obj instanceof THREE.Object3D;
export const isBufferGeometry = (obj: any): obj is THREE.BufferGeometry =>
  obj instanceof THREE.BufferGeometry;
export const isBufferAttribute = (obj: any): obj is THREE.BufferAttribute =>
  obj instanceof THREE.BufferAttribute;

// Re-export THREE namespace
export { THREE };
