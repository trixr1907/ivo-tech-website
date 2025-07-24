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
    export const DoubleSide: number;
    export const AdditiveBlending: number;

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

    export interface WebGLRenderer {
      setSize(width: number, height: number, updateStyle?: boolean): void;
      render(scene: Scene, camera: Camera): void;
      dispose(): void;
    }

    export interface Scene {
      add(object: Object3D): void;
      remove(object: Object3D): void;
    }

    export interface Camera {
      position: Vector3;
      rotation: Euler;
      lookAt(position: Vector3): void;
    }
  }
}
