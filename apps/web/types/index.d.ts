import * as React from 'react';
import * as THREE from 'three';

// React Erweiterungen
declare module 'react' {
  export type ReactNode = React.ReactNode;
  export type RefObject<T> = React.RefObject<T>;
  export type MutableRefObject<T> = React.MutableRefObject<T>;
  export type CSSProperties = React.CSSProperties;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type MouseEvent<T = Element> = React.MouseEvent<T>;
  export type ErrorInfo = {
    componentStack: string;
  };
}

// Three.js Erweiterungen
declare module 'three' {
  export interface WebGLRendererParameters {
    powerPreference?: 'high-performance' | 'low-power' | 'default';
  }

  export type ColorRepresentation = THREE.ColorRepresentation;
  export type Material = THREE.Material;
  export type BufferGeometry = THREE.BufferGeometry;
  export type Texture = THREE.Texture;
  export type Blending = THREE.Blending;
  export type Side = THREE.Side;
  export type Object3D = THREE.Object3D;
  export type Mesh = THREE.Mesh;
  export type Group = THREE.Group;
  export type Points = THREE.Points;
  export type Camera = THREE.Camera;
  export type PerspectiveCamera = THREE.PerspectiveCamera;
  export type OrthographicCamera = THREE.OrthographicCamera;
  export type Scene = THREE.Scene;
  export type WebGLRenderer = THREE.WebGLRenderer;
  export type ShaderMaterial = THREE.ShaderMaterial;
  export type MeshStandardMaterial = THREE.MeshStandardMaterial;
  export type Vector3 = THREE.Vector3;
  export type Matrix4 = THREE.Matrix4;
  export type Quaternion = THREE.Quaternion;
  export type Euler = THREE.Euler;
}

// Three.js Loader Typen
declare module 'three/examples/jsm/loaders/GLTFLoader' {
  export class GLTFLoader {
    constructor(manager?: THREE.LoadingManager);
    load(
      url: string,
      onLoad: (gltf: { scene: THREE.Object3D }) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (error: Error) => void
    ): void;
  }
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  export class DRACOLoader {
    constructor(manager?: THREE.LoadingManager);
    setDecoderPath(path: string): this;
    preload(): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/loaders/KTX2Loader' {
  export class KTX2Loader {
    constructor(manager?: THREE.LoadingManager);
    load(
      url: string,
      onLoad: (texture: THREE.Texture) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (error: Error) => void
    ): THREE.Texture;
    setTranscoderPath(path: string): this;
  }
}

// Performance API Erweiterungen
interface PerformanceEntry {
  readonly duration: number;
  readonly entryType: string;
  readonly name: string;
  readonly startTime: number;
  readonly processingStart?: number;
  readonly encodedBodySize?: number;
  readonly initiatorType?: string;
}

// HTML Erweiterungen
interface HTMLCanvasElement extends HTMLElement {
  getContext(contextId: '2d'): CanvasRenderingContext2D | null;
  getContext(contextId: 'webgl' | 'webgl2', options?: WebGLContextAttributes): WebGLRenderingContext | WebGL2RenderingContext | null;
  getContext(contextId: string, options?: any): RenderingContext | null;
  height: number;
  width: number;
  captureStream(frameRate?: number): MediaStream;
}

interface SVGAttributes<T> extends React.SVGAttributes<T> {
  strokeWidth?: string | number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  strokeMiterlimit?: string | number;
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeOpacity?: string | number;
}

// Zod Typen
declare module 'zod' {
  export interface ZodType<T = any> {
    parse(data: unknown): T;
    safeParse(data: unknown): { success: boolean; data?: T; error?: any };
  }
  
  export function z(): ZodType;
}

// React-Chartjs-2 Typen
declare module 'react-chartjs-2' {
  export class Line extends React.Component<any> {}
  export class Bar extends React.Component<any> {}
  export class Pie extends React.Component<any> {}
}

// Prisma Client Typen
declare module '@prisma/client' {
  export interface PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    [key: string]: any;
  }
}
