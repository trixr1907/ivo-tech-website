import {
  Vector3,
  Color,
  BufferAttribute,
  Points,
  Group,
  Mesh,
  Object3D,
  Matrix4,
  Quaternion,
  Euler,
  ShaderMaterial,
} from 'three';

declare global {
  namespace THREE {
    export {
      Vector3,
      Color,
      BufferAttribute,
      Points,
      Group,
      Mesh,
      Object3D,
      Matrix4,
      Quaternion,
      Euler,
      ShaderMaterial,
    };
  }
}
