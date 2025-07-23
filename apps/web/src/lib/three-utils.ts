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
} as const;

export const SIDES = {
  DOUBLE: DoubleSide,
} as const;

export const createNeonColor = (hex: string): Color => new Color(hex);
export const createPoint = (x: number, y: number, z: number): Vector3 =>
  new Vector3(x, y, z);

export type BlendingType = typeof BLENDING_TYPES[keyof typeof BLENDING_TYPES];
export type Side = typeof SIDES[keyof typeof SIDES];

export interface ThreeObject {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
  matrix: Matrix4;
  quaternion: Quaternion;
}

export const resetObject = (obj: ThreeObject): void => {
  obj.position.set(0, 0, 0);
  obj.rotation.set(0, 0, 0);
  obj.scale.set(1, 1, 1);
  obj.matrix.identity();
  obj.quaternion.identity();
};
