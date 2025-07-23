// Deklarationen für externe Module
import * as React from 'react';
import * as THREE from 'three';

// React-spezifische Erweiterungen
declare module 'react' {
  // React Core Typen
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
  }

  // Event Typen
  export interface FormEvent<T = Element> extends React.FormEvent<T> {}
  export interface MouseEvent<T = Element> extends React.MouseEvent<T> {}
  
  // Error Boundary Typen
  export interface ErrorInfo {
    componentStack: string;
  }

  // Component Typen
  export interface Component<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {}
}

// Three.js Erweiterungen
declare module 'three' {
  export interface WebGLRendererParameters {
    powerPreference?: 'high-performance' | 'low-power' | 'default';
    canvas?: HTMLCanvasElement;
    context?: WebGLRenderingContext;
    precision?: string;
    alpha?: boolean;
    premultipliedAlpha?: boolean;
    antialias?: boolean;
    stencil?: boolean;
    preserveDrawingBuffer?: boolean;
    powerPreference?: string;
    failIfMajorPerformanceCaveat?: boolean;
    depth?: boolean;
    logarithmicDepthBuffer?: boolean;
  }

  // Material Typen
  export interface Material extends THREE.Material {
    customProp?: any;
  }

  export interface ShaderMaterial extends THREE.ShaderMaterial {
    uniforms: { [uniform: string]: { value: any } };
  }

  // Geometrie Typen
  export interface BufferGeometry extends THREE.BufferGeometry {
    attributes: { [key: string]: THREE.BufferAttribute };
  }
}

// Modul-Deklarationen für Three.js Loader
declare module 'three/examples/jsm/loaders/GLTFLoader' {
  export * from 'three/examples/jsm/loaders/GLTFLoader';
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  export * from 'three/examples/jsm/loaders/DRACOLoader';
}

declare module 'three/examples/jsm/loaders/KTX2Loader' {
  export * from 'three/examples/jsm/loaders/KTX2Loader';
}

// React-Three/Fiber Erweiterungen
declare module '@react-three/fiber' {
  export interface ThreeElements {
    mesh: JSX.IntrinsicElements['mesh'];
    pointLight: JSX.IntrinsicElements['pointLight'];
    ambientLight: JSX.IntrinsicElements['ambientLight'];
    perspectiveCamera: JSX.IntrinsicElements['perspectiveCamera'];
    group: JSX.IntrinsicElements['group'];
  }
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
