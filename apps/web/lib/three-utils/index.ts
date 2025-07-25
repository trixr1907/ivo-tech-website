import * as THREE from 'three';

// Geometry exports
export const BufferGeometry = THREE.BufferGeometry;
export const IcosahedronGeometry = THREE.IcosahedronGeometry;
export const ConeGeometry = THREE.ConeGeometry;
export const PlaneGeometry = THREE.PlaneGeometry;
export const BoxGeometry = THREE.BoxGeometry;
export const SphereGeometry = THREE.SphereGeometry;
export const TorusGeometry = THREE.TorusGeometry;

// Material exports
export const Material = THREE.Material;
export const MeshStandardMaterial = THREE.MeshStandardMaterial;
export const MeshBasicMaterial = THREE.MeshBasicMaterial;
export const ShaderMaterial = THREE.ShaderMaterial;
export const PointsMaterial = THREE.PointsMaterial;

// Core exports
export const Scene = THREE.Scene;
export const WebGLRenderer = THREE.WebGLRenderer;
export const PerspectiveCamera = THREE.PerspectiveCamera;
export const OrthographicCamera = THREE.OrthographicCamera;

// Light exports
export const AmbientLight = THREE.AmbientLight;
export const DirectionalLight = THREE.DirectionalLight;
export const PointLight = THREE.PointLight;
export const SpotLight = THREE.SpotLight;

// Math exports
export const Vector2 = THREE.Vector2;
export const Vector3 = THREE.Vector3;
export const Vector4 = THREE.Vector4;
export const Matrix3 = THREE.Matrix3;
export const Matrix4 = THREE.Matrix4;
export const Quaternion = THREE.Quaternion;
export const Euler = THREE.Euler;
export const Box2 = THREE.Box2;
export const Box3 = THREE.Box3;
export const Sphere = THREE.Sphere;
export const Plane = THREE.Plane;
export const Ray = THREE.Ray;
export const Line3 = THREE.Line3;
export const Triangle = THREE.Triangle;
export const Color = THREE.Color;
export const Clock = THREE.Clock;

// Object exports
export const Object3D = THREE.Object3D;
export const Group = THREE.Group;
export const Mesh = THREE.Mesh;
export const Line = THREE.Line;
export const Points = THREE.Points;
export const Sprite = THREE.Sprite;

// Buffer exports
export const BufferAttribute = THREE.BufferAttribute;
export const Float32BufferAttribute = THREE.Float32BufferAttribute;
export const Uint16BufferAttribute = THREE.Uint16BufferAttribute;
export const Uint32BufferAttribute = THREE.Uint32BufferAttribute;

// Constants
export const DoubleSide = THREE.DoubleSide;
export const FrontSide = THREE.FrontSide;
export const BackSide = THREE.BackSide;
export const AdditiveBlending = THREE.AdditiveBlending;
export const NormalBlending = THREE.NormalBlending;
export const SubtractiveBlending = THREE.SubtractiveBlending;
export const MultiplyBlending = THREE.MultiplyBlending;
export const CustomBlending = THREE.CustomBlending;

// Math utils
export const MathUtils = THREE.MathUtils;
export const LinearFilter = THREE.LinearFilter;
export const NearestFilter = THREE.NearestFilter;

// Types
export type MaterialType = THREE.Material;
export type MeshStandardMaterialType = THREE.MeshStandardMaterial;
export type MeshBasicMaterialType = THREE.MeshBasicMaterial;
export type ShaderMaterialType = THREE.ShaderMaterial;
export type BufferGeometryType = THREE.BufferGeometry;
export type Vector3Type = THREE.Vector3;
export type ColorType = THREE.Color;
export type Object3DType = THREE.Object3D;
export type GroupType = THREE.Group;
export type MeshType = THREE.Mesh;
export type SceneType = THREE.Scene;
export type ClockType = THREE.Clock;

// Material parameter types
export type MaterialParameters = {
  color?: THREE.ColorRepresentation;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  fog?: boolean;
  blending?: THREE.Blending;
  depthWrite?: boolean;
  depthTest?: boolean;
};

export type MeshBasicMaterialParameters = MaterialParameters & {
  wireframe?: boolean;
  wireframeLinewidth?: number;
};

export type MeshStandardMaterialParameters = MaterialParameters & {
  roughness?: number;
  metalness?: number;
  emissive?: THREE.ColorRepresentation;
  emissiveIntensity?: number;
  wireframe?: boolean;
  wireframeLinewidth?: number;
};

export type ShaderMaterialParameters = MaterialParameters & {
  uniforms?: { [uniform: string]: { value: any } };
  vertexShader?: string;
  fragmentShader?: string;
};

// Type guards
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

export { THREE };
