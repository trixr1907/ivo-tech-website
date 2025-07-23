// Globale Typ-Erweiterungen
import * as React from 'react';
import * as THREE from 'three';

declare global {
  // DOM Erweiterungen
  interface HTMLElement {
    // Neon UI spezifische Attribute
    dataset: {
      [key: string]: string | undefined;
      neonEffect?: string;
      neonColor?: string;
      neonIntensity?: string;
    };
  }

  // SVG Erweiterungen
  interface SVGElement extends Element {
    dataset: {
      [key: string]: string | undefined;
      strokeWidth?: string;
      strokeColor?: string;
      fillOpacity?: string;
    };
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

  // Window Erweiterungen
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  }

  // Navigator Erweiterungen
  interface Navigator {
    getBattery?: () => Promise<any>;
    webkitGetUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
    mozGetUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
    msGetUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
  }

  // MediaDevices Erweiterungen
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  }

  // WebGL Erweiterungen
  interface WebGLRenderingContext {
    getExtension(name: string): any;
    getShaderPrecisionFormat(shadertype: number, precisiontype: number): any;
  }

  interface WebGL2RenderingContext extends WebGLRenderingContext {
    // WebGL2 spezifische Erweiterungen
  }

  // React Component Props
  namespace JSX {
    interface IntrinsicElements {
      'neon-button': React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
        effect?: string;
        color?: string;
        intensity?: string;
      };
      'neon-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        effect?: string;
        color?: string;
        intensity?: string;
      };
    }
  }
}
