declare module 'three' {
  export const ToneMapping: {
    NoToneMapping: number;
    LinearToneMapping: number;
    ReinhardToneMapping: number;
    CineonToneMapping: number;
    ACESFilmicToneMapping: number;
  };

  export const ColorSpace: {
    NoColorSpace: string;
    SRGBColorSpace: string;
    LinearSRGBColorSpace: string;
  };

  export const ACESFilmicToneMapping = ToneMapping.ACESFilmicToneMapping;
  export const SRGBColorSpace = ColorSpace.SRGBColorSpace;
  export class Object3D {
    position: Vector3;
    rotation: any;
    scale: Vector3;
    parent: Object3D | null;
    children: Object3D[];
    visible: boolean;

    add(...objects: Object3D[]): this;
    remove(...objects: Object3D[]): this;
    updateMatrix(): void;
    updateMatrixWorld(force?: boolean): void;
  }

  export class Group extends Object3D {
    constructor();
    isGroup: boolean;
  }

  export class Mesh extends Object3D {
    constructor(geometry?: any, material?: Material | Material[]);
    isMesh: boolean;
    geometry: any;
    material: Material | Material[];
  }

  export class Points extends Object3D {
    constructor(geometry?: any, material?: Material);
    isPoints: boolean;
    geometry: any;
    material: Material;
  }

  export class BufferAttribute {
    constructor(array: ArrayLike<number>, itemSize: number, normalized?: boolean);
    array: ArrayLike<number>;
    itemSize: number;
    count: number;
    normalized: boolean;
    updateRange: { offset: number; count: number };
    version: number;
    needsUpdate: boolean;
  }

  export class ShaderMaterial extends Material {
    constructor(parameters?: any);
    uniforms: { [uniform: string]: { value: any } };
    vertexShader: string;
    fragmentShader: string;
    isShaderMaterial: boolean;
  }

  export class Color {
    constructor(r?: number | string, g?: number, b?: number);
    r: number;
    g: number;
    b: number;
    set(color: Color | string | number): this;
    setRGB(r: number, g: number, b: number): this;
  }

  export const DoubleSide: number;
  export const AdditiveBlending: number;
  export const MathUtils: {
    degToRad(degrees: number): number;
    radToDeg(radians: number): number;
    clamp(value: number, min: number, max: number): number;
  };
  export class Material {
    transparent: boolean;
    opacity: number;
  }

  export class MeshBasicMaterial extends Material {
    constructor(parameters?: { color?: number | string; opacity?: number; transparent?: boolean });
  }

  export class Light {
    intensity: number;
    color: any;
  }

  export class AmbientLight extends Light {
    constructor(color?: number | string, intensity?: number);
  }

  export class PointLight extends Light {
    constructor(color?: number | string, intensity?: number, distance?: number, decay?: number);
    position: Vector3;
  }

  export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
  }

  export enum ToneMapping {
    NoToneMapping,
    LinearToneMapping,
    ReinhardToneMapping,
    CineonToneMapping,
    ACESFilmicToneMapping
  }

  export enum ColorSpace {
    NoColorSpace,
    SRGBColorSpace,
    LinearSRGBColorSpace
  }

  export const ACESFilmicToneMapping: ToneMapping;
  export const SRGBColorSpace: ColorSpace;
}
