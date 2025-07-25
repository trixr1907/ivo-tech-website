declare module 'three' {
  export * from 'three';

  interface Face3 {
    a: number;
    b: number;
    c: number;
    normal: Vector3;
  }

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

  interface Intersection {
    distance: number;
    point: Vector3;
    face: Face3;
    object: Object3D;
  }

  interface Point3 extends Vector3 {}

  export interface MeshBVH {
    geometry: BufferGeometry;
    shapecast: (callbacks: any) => void;
    bvhcast: (bvh: MeshBVH, callbacks: any) => void;
    traverse: (
      callback: (
        depth: number,
        isLeaf: boolean,
        boundingData: Float32Array,
        offset: number,
        count: number
      ) => void
    ) => void;
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

  export interface WebGLRendererParameters {
    antialias?: boolean;
    alpha?: boolean;
    powerPreference?: 'high-performance' | 'low-power' | 'default';
    outputColorSpace?: string;
    precision?: string;
    stencil?: boolean;
    depth?: boolean;
    preserveDrawingBuffer?: boolean;
    failIfMajorPerformanceCaveat?: boolean;
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

  export class BufferGeometry {
    constructor();
    isBufferGeometry: boolean;
    attributes: { [name: string]: BufferAttribute };
    setAttribute(name: string, attribute: BufferAttribute): this;
    dispose(): void;
    computeBoundsTree(): MeshBVH;
    disposeBoundsTree(): void;
  }

  export class Material {
    dispose(): void;
    needsUpdate: boolean;
    color: Color;
    emissive?: Color;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    metalness?: number;
    roughness?: number;
    wireframe?: boolean;
    fog?: boolean;
    vertexColors?: boolean;
    side?: number;
    blending?: number;
  }

  export class PointsMaterial extends Material {
    constructor(parameters?: any);
    size?: number;
    sizeAttenuation?: boolean;
  }

  export class ShaderMaterial extends Material {
    constructor(parameters?: any);
    uniforms?: { [uniform: string]: { value: any } };
    vertexShader?: string;
    fragmentShader?: string;
  }

  export class MeshStandardMaterial extends Material {
    constructor(parameters?: any);
  }

  export class PlaneGeometry extends BufferGeometry {
    constructor(
      width?: number,
      height?: number,
      widthSegments?: number,
      heightSegments?: number
    );
  }

  export class IcosahedronGeometry extends BufferGeometry {
    constructor(radius?: number, detail?: number);
  }

  export class ConeGeometry extends BufferGeometry {
    constructor(radius?: number, height?: number, radialSegments?: number);
  }

  export class FogExp2 {
    constructor(color: Color | string | number, density?: number);
  }

  export interface ShaderPass {
    isShaderMaterial: boolean;
    uniforms: { [key: string]: { value: any } };
  }

  export interface MathUtils {
    lerp(x: number, y: number, t: number): number;
    mapLinear(
      x: number,
      a1: number,
      a2: number,
      b1: number,
      b2: number
    ): number;
    smoothstep(x: number, min: number, max: number): number;
    degToRad(degrees: number): number;
    radToDeg(radians: number): number;
    clamp(value: number, min: number, max: number): number;
  }

  export const MathUtils: MathUtils;

  export const WebGLPowerPreference: {
    'high-performance': string;
    'low-power': string;
    default: string;
  };

  export interface Vector3 {
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    clone(): Vector3;
    copy(v: Vector3): this;
    setScalar(scalar: number): this;
  }

  export interface Matrix4 {
    setPosition(x: number | Vector3, y?: number, z?: number): this;
  }

  export interface BufferAttribute {
    count: number;
    array: ArrayLike<number>;
    itemSize: number;
  }
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

  interface Intersection {
    distance: number;
    point: Vector3;
    face: Face3;
    object: Object3D;
  }

  interface Point3 extends Vector3 {}

  interface Face3 {
    a: number;
    b: number;
    c: number;
    normal: Vector3;
  }

  export interface MeshBVH {
    geometry: BufferGeometry;
    shapecast: (callbacks: any) => void;
    bvhcast: (bvh: MeshBVH, callbacks: any) => void;
    traverse: (
      callback: (
        depth: number,
        isLeaf: boolean,
        boundingData: Float32Array,
        offset: number,
        count: number
      ) => void
    ) => void;
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

  export interface WebGLRendererParameters {
    antialias?: boolean;
    alpha?: boolean;
    powerPreference?: 'high-performance' | 'low-power' | 'default';
    outputColorSpace?: string;
    precision?: string;
    stencil?: boolean;
    depth?: boolean;
    preserveDrawingBuffer?: boolean;
    failIfMajorPerformanceCaveat?: boolean;
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
  export * from 'three';

  export interface WebGLRendererParameters {
    antialias?: boolean;
    alpha?: boolean;
    powerPreference?: 'high-performance' | 'low-power' | 'default';
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

  interface Box3 {}
  interface Sphere {}
  interface Ray {}
  interface Intersection {}
  interface Point3 {}

  interface Box3 {}
  interface Sphere {}
  interface Ray {}
  interface Intersection {}
  interface Point3 {}
  interface Geometry {}

  export interface MeshBVH {
    geometry: BufferGeometry;
    shapecast: (callbacks: any) => void;
    bvhcast: (bvh: MeshBVH, callbacks: any) => void;
    traverse: (
      callback: (
        depth: number,
        isLeaf: boolean,
        boundingData: Float32Array,
        offset: number,
        count: number
      ) => void
    ) => void;
    refit: () => void;
    getBoundingBox: (target: Box3) => Box3;
    geometry: BufferGeometry;
    raycast: (ray: any, intersects: any[]) => void;
    raycastFirst: (ray: any) => any;
    intersectsSphere: (sphere: any) => boolean;
    intersectsBox: (box: any) => boolean;
    intersectsGeometry: (geometry: any) => boolean;
    closestPointToPoint: (point: any) => any;
    closestPointToGeometry: (geometry: any) => any;
    bvhGeometry: any;
    intersectsBox: (box: Box3) => boolean;
    intersectsGeometry: (geometry: BufferGeometry) => boolean;
    closestPointToPoint: (point: Point3) => Point3;
    closestPointToGeometry: (geometry: BufferGeometry) => Point3;
    raycastFirst: (ray: Ray) => Intersection | null;
    raycast: (ray: Ray, intersects: Intersection[]) => void;
    geometry: BufferGeometry;
    raycast: (ray: any, intersects: any[]) => void;
    raycastFirst: (ray: any) => any;
    intersectsSphere: (sphere: any) => boolean;
    computeBoundsTree: () => void;
    disposeBoundsTree: () => void;
  }

  export class BufferGeometry {
    constructor();
    isBufferGeometry: boolean;
    attributes: { [name: string]: any };
    setAttribute(name: string, attribute: any): this;
    dispose(): void;
    computeBoundsTree?(): MeshBVH;
    disposeBoundsTree?(): void;
  }

  export class Material {
    dispose(): void;
    needsUpdate: boolean;
    color: Color;
    emissive?: Color;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    metalness?: number;
    roughness?: number;
    wireframe?: boolean;
    fog?: boolean;
    vertexColors?: boolean;
  }

  export class PointsMaterial extends Material {
    constructor(parameters?: any);
    size?: number;
    sizeAttenuation?: boolean;
  }

  export class ShaderMaterial extends Material {
    constructor(parameters?: any);
    uniforms?: { [uniform: string]: { value: any } };
    vertexShader?: string;
    fragmentShader?: string;
  }

  export class MeshStandardMaterial extends Material {
    constructor(parameters?: any);
  }

  export class PlaneGeometry extends BufferGeometry {
    constructor(
      width?: number,
      height?: number,
      widthSegments?: number,
      heightSegments?: number
    );
  }

  export class IcosahedronGeometry extends BufferGeometry {
    constructor(radius?: number, detail?: number);
  }

  export class ConeGeometry extends BufferGeometry {
    constructor(radius?: number, height?: number, radialSegments?: number);
  }

  export class FogExp2 {
    constructor(color: Color | string | number, density?: number);
  }

  export interface ShaderPass {
    isShaderMaterial: boolean;
    uniforms: { [key: string]: { value: any } };
  }

  export interface MathUtils {
    lerp(x: number, y: number, t: number): number;
    mapLinear(
      x: number,
      a1: number,
      a2: number,
      b1: number,
      b2: number
    ): number;
    smoothstep(x: number, min: number, max: number): number;
    degToRad(degrees: number): number;
    radToDeg(radians: number): number;
    clamp(value: number, min: number, max: number): number;
  }

  export const MathUtils: MathUtils;

  export const WebGLPowerPreference: {
    'high-performance': string;
    'low-power': string;
    default: string;
  };

  export interface Vector3 {
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    clone(): Vector3;
    copy(v: Vector3): this;
    setScalar(scalar: number): this;
  }

  export interface Matrix4 {
    setPosition(x: number | Vector3, y?: number, z?: number): this;
  }

  export interface BufferAttribute {
    count: number;
    array: ArrayLike<number>;
    itemSize: number;
  }
  export * from 'three';
  export {
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    BoxGeometry,
    SphereGeometry,
    TorusGeometry,
    MeshStandardMaterial,
    MeshBasicMaterial,
    PointLight,
    AmbientLight,
    SpotLight,
    Vector3,
    Color,
    BufferAttribute,
    AdditiveBlending,
    MeshPhysicalMaterial,
    CylinderGeometry,
    InstancedMesh,
    ShaderMaterial,
    DataTexture,
    RedFormat,
    Texture,
    ACESFilmicToneMapping,
    SRGBColorSpace,
    MathUtils,
  } from 'three';

  export interface WebGLRendererParameters {
    antialias?: boolean;
    alpha?: boolean;
  }

  export interface WebGLRenderer {
    setPixelRatio(value: number): void;
    setSize(width: number, height: number): void;
    toneMapping: number;
    toneMappingExposure: number;
    domElement: HTMLCanvasElement;
    dispose(): void;
  }

  export interface Material {
    color: Color;
    emissive?: Color;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    metalness?: number;
    roughness?: number;
    wireframe?: boolean;
    fog?: boolean;
    vertexColors?: boolean;
  }

  export interface Vector3 {
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    clone(): Vector3;
    copy(v: Vector3): this;
    setScalar(scalar: number): this;
  }

  export interface MathUtils {
    lerp(x: number, y: number, t: number): number;
    mapLinear(
      x: number,
      a1: number,
      a2: number,
      b1: number,
      b2: number
    ): number;
    smoothstep(x: number, min: number, max: number): number;
    degToRad(degrees: number): number;
    radToDeg(radians: number): number;
    clamp(value: number, min: number, max: number): number;
  }

  export const MathUtils: MathUtils;

  export const WebGLPowerPreference: {
    'high-performance': string;
    'low-power': string;
    default: string;
  };

  export class CubeTexture {}
  export class FogExp2 {}
  export class PointsMaterial {}
  export class IcosahedronGeometry {}
  export class ConeGeometry {}
  export class PlaneGeometry {}

  export interface Matrix4 {
    setPosition(x: number | Vector3, y?: number, z?: number): this;
  }

  export interface BufferAttribute {
    count: number;
    array: ArrayLike<number>;
    itemSize: number;
  }
}
