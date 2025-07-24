import {
  Color,
  Vector3,
  Vector2,
  Points,
  Group,
  Mesh,
  Object3D,
  BufferAttribute,
  Matrix4,
  Quaternion,
  Euler,
  ShaderMaterial,
  DoubleSide,
  AdditiveBlending,
  MathUtils,
  MeshBasicMaterial,
  AmbientLight,
  PointLight,
} from 'three';

// Re-export all Three.js components
export {
  Color,
  Vector3,
  Vector2,
  Points,
  Group,
  Mesh,
  Object3D,
  BufferAttribute,
  Matrix4,
  Quaternion,
  Euler,
  ShaderMaterial,
  DoubleSide,
  AdditiveBlending,
  MathUtils,
  MeshBasicMaterial,
  AmbientLight,
  PointLight,
};

// Export commonly used constants and helper functions
export const BLENDING_TYPES = {
  ADDITIVE: AdditiveBlending,
};

export const SIDES = {
  DOUBLE: DoubleSide,
};

export const createNeonColor = (hex: string) => new Color(hex);
export const createPoint = (x: number, y: number, z: number) =>
  new Vector3(x, y, z);
