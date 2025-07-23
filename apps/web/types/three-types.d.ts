import * as THREE from 'three';
import {
  Object3D,
  Material,
  BufferGeometry,
  MaterialParameters,
  Color,
  Vector2,
  Vector3,
  Vector4,
  Matrix3,
  Matrix4,
  Quaternion,
  Euler,
  BufferAttribute,
  ShaderMaterial,
  MeshStandardMaterial,
  WebGLRenderer,
  Scene,
  Camera,
  Texture,
  Light,
  Group,
  Points,
  ColorRepresentation,
  Side,
  Blending,
  TextureFilter,
  Wrapping,
  Mapping,
  PixelFormat,
  TextureDataType
} from 'three';
import type { ReactThreeFiber } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface NodeProps<T, P> {
    attach?: string;
    args?: P[];
    children?: React.ReactNode;
    ref?: React.Ref<T>;
    key?: React.Key;
  }

  type OverwrittenProps<T, P> = { [K in keyof T]: K extends keyof P ? P[K] : T[K] };

  type Overwrite<T, P> = Omit<T, keyof P> & P;

  interface MaterialProps {
    color?: ColorRepresentation;
    opacity?: number;
    transparent?: boolean;
    side?: Side;
    blending?: Blending;
    wireframe?: boolean;
    vertexColors?: boolean;
    visible?: boolean;
  }

  interface StandardMaterialProps extends MaterialProps {
    roughness?: number;
    metalness?: number;
    emissive?: ColorRepresentation;
    emissiveIntensity?: number;
  }

  interface ShaderMaterialProps extends MaterialProps {
    uniforms?: { [uniform: string]: THREE.IUniform };
    vertexShader?: string;
    fragmentShader?: string;
  }
  interface BaseMaterialProps {
    attach?: string;
    args?: any[];
    children?: React.ReactNode;
    ref?: React.Ref<Material>;
    attachArray?: string;
    attachObject?: [string, string];
    key?: React.Key;
  }

  interface MaterialProps extends StandardMaterialProps, BaseMaterialProps {
    args?: any[];
    children?: React.ReactNode;
    ref?: React.Ref<Material>;
    attach?: string;
    attachArray?: string;
    attachObject?: [string, string];
  }

  interface MaterialNode<T extends Material, P> extends BaseMaterialProps {
    args?: P;
    attach?: string;
    attachArray?: string;
    attachObject?: [string, string];
    children?: React.ReactNode;
    key?: React.Key;
    ref?: React.Ref<T>;

    // Material common props
    alphaTest?: number;
    alphaToCoverage?: boolean;
    blendDst?: THREE.BlendingDstFactor;
    blendDstAlpha?: number;
    blendEquation?: THREE.BlendingEquation;
    blendEquationAlpha?: number;
    blending?: THREE.Blending;
    blendSrc?: THREE.BlendingSrcFactor;
    blendSrcAlpha?: number;
    clipIntersection?: boolean;
    clippingPlanes?: THREE.Plane[];
    clipShadows?: boolean;
    colorWrite?: boolean;
    defines?: { [key: string]: any };
    depthFunc?: THREE.DepthModes;
    depthTest?: boolean;
    depthWrite?: boolean;
    stencilWrite?: boolean;
    stencilWriteMask?: number;
    stencilFunc?: THREE.StencilFunc;
    stencilRef?: number;
    stencilFuncMask?: number;
    stencilFail?: THREE.StencilOp;
    stencilZFail?: THREE.StencilOp;
    stencilZPass?: THREE.StencilOp;
    fog?: boolean;
    needsUpdate?: boolean;
    opacity?: number;
    polygonOffset?: boolean;
    polygonOffsetFactor?: number;
    polygonOffsetUnits?: number;
    precision?: 'highp' | 'mediump' | 'lowp';
    premultipliedAlpha?: boolean;
    dithering?: boolean;
    shadowSide?: THREE.Side;
    side?: THREE.Side;
    toneMapped?: boolean;
    transparent?: boolean;
    vertexColors?: boolean;
    visible?: boolean;
    format?: THREE.PixelFormat;
    stencilBuffer?: boolean;
    
    // Extended material props
    color?: THREE.ColorRepresentation;
    emissive?: THREE.ColorRepresentation;
    emissiveIntensity?: number;
    metalness?: number;
    roughness?: number;
    wireframe?: boolean;
    
    // Shader material specific props
    uniforms?: { [uniform: string]: THREE.IUniform };
    vertexShader?: string;
    fragmentShader?: string;
    color?: THREE.ColorRepresentation;
    emissive?: THREE.ColorRepresentation;
    emissiveIntensity?: number;
    metalness?: number;
    roughness?: number;
    transparent?: boolean;
    opacity?: number;
    side?: THREE.Side;
    toneMapped?: boolean;
    depthTest?: boolean;
    depthWrite?: boolean;
    wireframe?: boolean;
    vertexColors?: boolean;
    blending?: THREE.Blending;
  }

type MaterialType = THREE.Material | THREE.Material[];

interface ExtendedColors<T> extends MaterialNode<T extends MaterialType ? T : THREE.Material, any[]> {
    color?: THREE.ColorRepresentation;
    emissive?: THREE.ColorRepresentation;
    emissiveIntensity?: number;
  }
  // Three.js base classes
  export const Vector2: typeof THREE.Vector2;
  export const Vector3: typeof THREE.Vector3;
  export const Vector4: typeof THREE.Vector4;
  export const Matrix3: typeof THREE.Matrix3;
  export const Matrix4: typeof THREE.Matrix4;
  export const Quaternion: typeof THREE.Quaternion;
  export const Euler: typeof THREE.Euler;
  export const BufferGeometry: typeof THREE.BufferGeometry;
  export const Points: typeof THREE.Points;
  export const ShaderMaterial: typeof THREE.ShaderMaterial;
  export const MeshStandardMaterial: typeof THREE.MeshStandardMaterial;
  export const WebGLRenderer: typeof THREE.WebGLRenderer;
  export const MathUtils: typeof THREE.MathUtils;

  // Re-export necessary Three.js types
  export type Color = THREE.Color;
  export type Vector2 = THREE.Vector2;
  export type Vector3 = THREE.Vector3;
  export type Vector4 = THREE.Vector4;
  export type Matrix3 = THREE.Matrix3;
  export type Matrix4 = THREE.Matrix4;
  export type Quaternion = THREE.Quaternion;
  export type Euler = THREE.Euler;
  export type BufferAttribute = THREE.BufferAttribute;
  export type ShaderMaterial = THREE.ShaderMaterial;
  export type MeshStandardMaterial = THREE.MeshStandardMaterial;
  export type WebGLRenderer = THREE.WebGLRenderer;
  export type Scene = THREE.Scene;
  export type Camera = THREE.Camera;
  export type Texture = THREE.Texture;
  export type Light = THREE.Light;
  export type Group = THREE.Group;
  export type Object3D = THREE.Object3D;
  export type Points = THREE.Points;
  export type ColorRepresentation = THREE.ColorRepresentation;
  export type Side = THREE.Side;
  export type Blending = THREE.Blending;
  export type TextureFilter = THREE.TextureFilter;
  export type Wrapping = THREE.Wrapping;
  export type Mapping = THREE.Mapping;
  export type PixelFormat = THREE.PixelFormat;
  export type TextureDataType = THREE.TextureDataType;
  export type WebGLPowerPreference = THREE.WebGLPowerPreference;

  interface BufferGeometryNode<T extends BufferGeometry> extends Object3DNode<T, any> {
    attributes?: { [name: string]: THREE.BufferAttribute | null };
    index?: THREE.BufferAttribute | null;
    morphAttributes?: { [name: string]: THREE.BufferAttribute[] };
    morphTargetsRelative?: boolean;
    drawRange?: { start: number; count: number };
    userData?: { [key: string]: any };
    dispose?: (() => void) | null;
  }

  type MaterialNode<T extends Material, P> = Overwrite<StandardMaterialProps, NodeProps<T, P>>;
  type ShaderNode<T extends ShaderMaterial, P> = Overwrite<ShaderMaterialProps, NodeProps<T, P>>;

  interface ThreeElements {
    mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    points: ReactThreeFiber.Object3DNode<THREE.Points, typeof THREE.Points>;
    group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
    line: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>;
    lineSegments: ReactThreeFiber.Object3DNode<THREE.LineSegments, typeof THREE.LineSegments>;
    sprite: ReactThreeFiber.Object3DNode<THREE.Sprite, typeof THREE.Sprite>;
    instancedMesh: ReactThreeFiber.Object3DNode<THREE.InstancedMesh, typeof THREE.InstancedMesh>;

    // Lights
    ambientLight: ReactThreeFiber.Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
    directionalLight: ReactThreeFiber.Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
    pointLight: ReactThreeFiber.Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
    spotLight: ReactThreeFiber.Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
    hemisphereLight: ReactThreeFiber.Object3DNode<THREE.HemisphereLight, typeof THREE.HemisphereLight>;
    rectAreaLight: ReactThreeFiber.Object3DNode<THREE.RectAreaLight, typeof THREE.RectAreaLight>;

    // Cameras
    perspectiveCamera: ReactThreeFiber.Object3DNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera>;
    orthographicCamera: ReactThreeFiber.Object3DNode<THREE.OrthographicCamera, typeof THREE.OrthographicCamera>;

    // Materials
    meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, [THREE.MeshStandardMaterialParameters]>;
    meshBasicMaterial: ReactThreeFiber.MaterialNode<THREE.MeshBasicMaterial, [THREE.MeshBasicMaterialParameters]>;
    meshPhongMaterial: ReactThreeFiber.MaterialNode<THREE.MeshPhongMaterial, [THREE.MeshPhongMaterialParameters]>;
    meshPhysicalMaterial: ReactThreeFiber.MaterialNode<THREE.MeshPhysicalMaterial, [THREE.MeshPhysicalMaterialParameters]>;
    shaderMaterial: ReactThreeFiber.MaterialNode<THREE.ShaderMaterial, [THREE.ShaderMaterialParameters]>;
    rawShaderMaterial: ReactThreeFiber.MaterialNode<THREE.RawShaderMaterial, [THREE.ShaderMaterialParameters]>;
  }
}

declare module 'three' {
  interface Object3D {
    material?: Material | Material[];
    geometry?: BufferGeometry;
  }
}

export interface ThreeEvent<T> extends Event {
  point: THREE.Vector3;
  distance: number;
  object: THREE.Object3D;
  eventObject: THREE.Object3D;
  intersections: THREE.Intersection[];
  nativeEvent: T;
}

export interface BaseProps {
  children?: React.ReactNode;
  ref?: React.Ref<any>;
  key?: React.Key;
  args?: any[];
}

export interface Object3DProps extends BaseProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  matrix?: THREE.Matrix4;
  quaternion?: THREE.Quaternion;
  layers?: THREE.Layers;
  dispose?: (() => void) | null;
}

export interface MaterialProps extends Omit<MaterialNode<THREE.Material, any[]>, 'args'> {
  attach?: string;
  attachArray?: string;
  attachObject?: [string, string];
  args?: any[];
  color?: THREE.ColorRepresentation;
  emissive?: THREE.ColorRepresentation;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  transparent?: boolean;
  side?: THREE.Side;
  toneMapped?: boolean;
  depthTest?: boolean;
  depthWrite?: boolean;
  wireframe?: boolean;
  vertexColors?: boolean;
  visible?: boolean;
  blending?: THREE.Blending;
  attach?: string;
  color?: THREE.ColorRepresentation;
  opacity?: number;
  transparent?: boolean;
  side?: THREE.Side;
  toneMapped?: boolean;
  vertexColors?: boolean;
  visible?: boolean;
  wireframe?: boolean;
}

export interface MeshProps extends Object3DProps {
  material?: THREE.Material | THREE.Material[];
  geometry?: THREE.BufferGeometry;
  morphTargetInfluences?: number[];
  morphTargetDictionary?: { [key: string]: number };
}

export interface LightProps extends Object3DProps {
  color?: THREE.ColorRepresentation;
  intensity?: number;
  target?: THREE.Object3D;
  shadow?: THREE.LightShadow;
}

export interface CameraProps extends Object3DProps {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  zoom?: number;
  filmGauge?: number;
  filmOffset?: number;
  view?: any;
  focus?: number;
}
