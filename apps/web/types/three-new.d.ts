declare module 'three' {
  export * from 'three';

  interface Box3 {
    min: Vector3;
    max: Vector3;
  }

  interface Sphere {
    center: Vector3;
    radius: number;
  }

  interface Ray {
    origin: Vector3;
    direction: Vector3;
  }

  interface Face3 {
    a: number;
    b: number;
    c: number;
    normal: Vector3;
  }

  interface Point3 extends Vector3 {}

  interface Intersection {
    distance: number;
    point: Vector3;
    face: Face3;
    object: Object3D;
  }

  interface BufferAttribute {
    count: number;
    array: ArrayLike<number>;
    itemSize: number;
  }

  export interface Material {
    color: Color;
    transparent?: boolean;
    opacity?: number;
    side?: number;
    metalness?: number;
    roughness?: number;
    emissive?: Color;
    emissiveIntensity?: number;
    fog?: boolean;
    wireframe?: boolean;
    vertexColors?: boolean;
    blending?: number;
    alphaTest?: number;
    depthTest?: boolean;
    depthWrite?: boolean;
    dispose?: () => void;
    needsUpdate?: boolean;
  }

  interface MeshStandardMaterialParameters {
    color?: number | string | Color;
    roughness?: number;
    metalness?: number;
    emissive?: number | string | Color;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    wireframe?: boolean;
    side?: number;
    alphaTest?: number;
    depthTest?: boolean;
    depthWrite?: boolean;
    vertexColors?: boolean;
    blending?: number;
  }

  interface PointsMaterialParameters {
    color?: number | string | Color;
    size?: number;
    sizeAttenuation?: boolean;
    transparent?: boolean;
    opacity?: number;
    alphaTest?: number;
    depthTest?: boolean;
    depthWrite?: boolean;
    vertexColors?: boolean;
    blending?: number;
  }

  interface ShaderMaterialParameters {
    uniforms?: { [uniform: string]: { value: any } };
    vertexShader?: string;
    fragmentShader?: string;
    transparent?: boolean;
    opacity?: number;
    blending?: number;
    side?: number;
  }

  export class MeshStandardMaterial extends Material {
    constructor(parameters?: MeshStandardMaterialParameters);
  }

  export class PointsMaterial extends Material {
    constructor(parameters?: PointsMaterialParameters);
    size?: number;
    sizeAttenuation?: boolean;
  }

  export class ShaderMaterial extends Material {
    constructor(parameters?: ShaderMaterialParameters);
    uniforms?: { [uniform: string]: { value: any } };
    vertexShader?: string;
    fragmentShader?: string;
  }

  export interface WebGLRendererParameters {
    precision?: string;
    alpha?: boolean;
    antialias?: boolean;
    stencil?: boolean;
    depth?: boolean;
    preserveDrawingBuffer?: boolean;
    powerPreference?: 'high-performance' | 'low-power' | 'default';
    failIfMajorPerformanceCaveat?: boolean;
    outputColorSpace?: string;
  }

  export class WebGLRenderer {
    constructor(parameters?: WebGLRendererParameters);
    setPixelRatio(value: number): void;
    setSize(width: number, height: number): void;
    toneMapping: number;
    toneMappingExposure: number;
    domElement: HTMLCanvasElement;
    dispose(): void;
  }

  export class Scene {
    constructor();
    add(object: Object3D): this;
    remove(object: Object3D): this;
    children: Object3D[];
  }

  export class Camera {
    position: Vector3;
    rotation: Vector3;
    quaternion: Quaternion;
    up: Vector3;
    lookAt(target: Vector3 | [number, number, number]): void;
  }

  export class Clock {
    getElapsedTime(): number;
    getDelta(): number;
  }

  export interface ShaderPass {
    uniforms: { [key: string]: { value: any } };
  }

  export interface MathUtils {
    lerp(x: number, y: number, t: number): number;
    mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number;
    smoothstep(x: number, min: number, max: number): number;
    degToRad(degrees: number): number;
    radToDeg(radians: number): number;
    clamp(value: number, min: number, max: number): number;
  }

  export const MathUtils: MathUtils;

  export const WebGLPowerPreference: {
    'high-performance': string;
    'low-power': string;
    'default': string;
  };

  export class BufferGeometry {
    constructor();
    isBufferGeometry: boolean;
    attributes: { [name: string]: BufferAttribute };
    setAttribute(name: string, attribute: BufferAttribute): this;
    dispose(): void;
    computeBoundsTree?(): MeshBVH;
    disposeBoundsTree?(): void;
  }

  export interface MeshBVH {
    geometry: BufferGeometry;
    shapecast: (callbacks: any) => void;
    bvhcast: (bvh: MeshBVH, callbacks: any) => void;
    traverse: (callback: (depth: number, isLeaf: boolean, boundingData: Float32Array, offset: number, count: number) => void) => void;
    refit: () => void;
    getBoundingBox: (target: Box3) => Box3;
    raycast: (ray: Ray, intersects: Intersection[]) => void;
    raycastFirst: (ray: Ray) => Intersection | null;
    intersectsSphere: (sphere: Sphere) => boolean;
    intersectsBox: (box: Box3) => boolean;
    intersectsGeometry: (geometry: BufferGeometry) => boolean;
    closestPointToPoint: (point: Point3) => Point3;
    closestPointToGeometry: (geometry: BufferGeometry) => Point3;
  }

  export class PlaneGeometry extends BufferGeometry {
    constructor(width?: number, height?: number, widthSegments?: number, heightSegments?: number);
  }

  export class IcosahedronGeometry extends BufferGeometry {
    constructor(radius?: number, detail?: number);
  }

  export class ConeGeometry extends BufferGeometry {
    constructor(radius?: number, height?: number, radialSegments?: number);
  }

  export class Color {
    constructor(color: number | string);
    r: number;
    g: number;
    b: number;
    set(color: number | string | Color): this;
  }

  export class Vector3 {
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    clone(): Vector3;
    copy(v: Vector3): this;
    setScalar(scalar: number): this;
  }

  export class Matrix4 {
    setPosition(x: number | Vector3, y?: number, z?: number): this;
  }

  export class Object3D {
    position: Vector3;
    rotation: Vector3;
    quaternion: Quaternion;
    scale: Vector3;
    up: Vector3;
    lookAt(target: Vector3 | [number, number, number]): void;
    add(object: Object3D): this;
    remove(object: Object3D): this;
    children: Object3D[];
  }
}
