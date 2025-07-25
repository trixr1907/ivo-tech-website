import * as THREE from 'three';

declare module 'three' {
  export * from 'three';

  interface WebGLRenderer {
    info: {
      memory: {
        geometries: number;
        textures: number;
      };
      render: {
        calls: number;
        triangles: number;
        points: number;
        lines: number;
      };
    };
  }

  interface Mesh {
    add(object: Object3D): this;
  }

  interface Performance {
    memory: {
      usedJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }

  interface Material {
    color?: Color;
    emissive?: Color;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    metalness?: number;
    roughness?: number;
    wireframe?: boolean;
    fog?: boolean;
    vertexColors?: boolean;
    blending?: number;
    side?: number;
    alphaTest?: number;
    size?: number;
    sizeAttenuation?: boolean;
  }

  interface Vector3 {
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    clone(): Vector3;
    copy(v: Vector3): this;
    setScalar(scalar: number): this;
  }

  interface ShaderMaterial {
    uniforms?: { [uniform: string]: { value: any; }; };
    vertexShader?: string;
    fragmentShader?: string;
    transparent?: boolean;
    blending?: number;
  }

  interface Matrix4 {
    setPosition(x: number | Vector3, y?: number, z?: number): this;
  }

  interface BufferAttribute {
    count: number;
    array: ArrayLike<number>;
    itemSize: number;
  }

  interface ShaderPass {
    uniforms: { [key: string]: { value: any; }; };
  }

  export const MathUtils: {
    lerp(x: number, y: number, t: number): number;
    damp(x: number, y: number, lambda: number, dt: number): number;
    randFloat(low: number, high: number): number;
    randFloatSpread(range: number): number;
    degToRad(degrees: number): number;
    radToDeg(radians: number): number;
    smoothstep(x: number, min: number, max: number): number;
  };

  export const WebGLPowerPreference: {
    'high-performance': string;
    'low-power': string;
    'default': string;
  };

  export class CubeTexture extends Texture {}

  export interface ExtendedMaterialParameters extends MaterialParameters {
    color?: number | string | Color;
    transparent?: boolean;
    opacity?: number;
    metalness?: number;
    roughness?: number;
    emissive?: number | string | Color;
    emissiveIntensity?: number;
    fog?: boolean;
    wireframe?: boolean;
  }

  export class WebGLRenderer extends THREE.WebGLRenderer {}
  export class PerspectiveCamera extends THREE.PerspectiveCamera {}
  export class Scene extends THREE.Scene {}
  export class BoxGeometry extends THREE.BoxGeometry {}
  export class SphereGeometry extends THREE.SphereGeometry {}
  export class TorusGeometry extends THREE.TorusGeometry {}
  export class CylinderGeometry extends THREE.CylinderGeometry {}
  export class IcosahedronGeometry extends THREE.IcosahedronGeometry {}
  export class ConeGeometry extends THREE.ConeGeometry {}
  export class PlaneGeometry extends THREE.PlaneGeometry {}
  export class MeshStandardMaterial extends THREE.MeshStandardMaterial {}
  export class MeshBasicMaterial extends THREE.MeshBasicMaterial {}
  export class PointLight extends THREE.PointLight {}
  export class AmbientLight extends THREE.AmbientLight {}
  export class SpotLight extends THREE.SpotLight {}
  export class PointsMaterial extends THREE.PointsMaterial {}
  export class FogExp2 extends THREE.FogExp2 {}

  export interface ExtendedColors<T> {
    color?: T;
    emissive?: T;
    transparent?: boolean;
    opacity?: number;
    metalness?: number;
    roughness?: number;
    emissiveIntensity?: number;
    fog?: boolean;
    wireframe?: boolean;
  }
}
