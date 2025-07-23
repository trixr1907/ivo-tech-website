import { Vector3, Matrix4, Color, Material, Object3D, BufferGeometry, Points, Group, Mesh, Quaternion, Euler, ShaderMaterial, EventDispatcher, Intersection, Line3, Box3, Ray, Scene } from 'three';

declare module 'three' {
  export class Vector3 extends Vector3 {}
  export class Matrix4 extends Matrix4 {}
  export class Color extends Color {}
  export class Material extends Material {}
  export class Object3D extends Object3D {}
  export class BufferGeometry extends BufferGeometry {}
  export class Points extends Points {}
  export class Group extends Group {}
  export class Mesh extends Mesh {}
  export class Quaternion extends Quaternion {}
  export class Euler extends Euler {}
  export class ShaderMaterial extends ShaderMaterial {}
  export class EventDispatcher extends EventDispatcher {}
  export class Intersection extends Intersection {}
  export class Line3 extends Line3 {}
  export class Box3 extends Box3 {}
  export class Ray extends Ray {}
  export class Scene extends Scene {}

  export interface IUniform {
    value: any;
  }

  export interface ColorRepresentation {}
  export interface TextureDataType {}
  export interface PixelFormat {}
  export interface Mapping {}
  export interface Side {}
  export interface Wrapping {}
}

declare module 'three' {
  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    clone(): Vector3;
    add(v: Vector3): Vector3;
    multiplyScalar(scalar: number): Vector3;
  }

  export class Color {
    constructor(r?: number | string, g?: number, b?: number);
    r: number;
    g: number;
    b: number;
    setHSL(h: number, s: number, l: number): Color;
  }

  export class BufferAttribute {
    constructor(
      array: ArrayLike<number>,
      itemSize: number,
      normalized?: boolean
    );
    array: ArrayLike<number>;
    needsUpdate: boolean;
  }

  export class Points extends Object3D {
    constructor(geometry?: BufferGeometry, material?: Material);
    type: 'Points';
    geometry: BufferGeometry;
    material: Material;
  }

  export class Group extends Object3D {
    constructor();
    type: 'Group';
  }

  export class Mesh extends Object3D {
    constructor(geometry?: BufferGeometry, material?: Material | Material[]);
    type: 'Mesh';
    geometry: BufferGeometry;
    material: Material | Material[];
  }

  export class Object3D {
    position: Vector3;
    rotation: Euler;
    scale: Vector3;
    matrix: Matrix4;
    children: Object3D[];
    parent: Object3D | null;
  }

  export class Euler {
    constructor(x?: number, y?: number, z?: number, order?: string);
    x: number;
    y: number;
    z: number;
    order: string;
  }

  export class Matrix4 {
    elements: number[];
    set(
      n11: number,
      n12: number,
      n13: number,
      n14: number,
      n21: number,
      n22: number,
      n23: number,
      n24: number,
      n31: number,
      n32: number,
      n33: number,
      n34: number,
      n41: number,
      n42: number,
      n43: number,
      n44: number
    ): Matrix4;
    compose(position: Vector3, quaternion: Quaternion, scale: Vector3): Matrix4;
  }

  export class Quaternion {
    constructor(x?: number, y?: number, z?: number, w?: number);
    x: number;
    y: number;
    z: number;
    w: number;
  }

  export class Material {
    dispose(): void;
    needsUpdate: boolean;
  }

  export class BufferGeometry {
    dispose(): void;
    attributes: {
      [name: string]: BufferAttribute;
    };
    setAttribute(name: string, attribute: BufferAttribute): BufferGeometry;
  }

  export class ShaderMaterial extends Material {
    constructor(parameters?: {
      uniforms?: { [uniform: string]: { value: any } };
      vertexShader?: string;
      fragmentShader?: string;
      transparent?: boolean;
    });
    uniforms: { [uniform: string]: { value: any } };
  }

  export class Vector2 {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
  }

  export const DoubleSide: number;
  export const AdditiveBlending: number;
  export const MathUtils: {
    lerp(x: number, y: number, t: number): number;
  };
}
