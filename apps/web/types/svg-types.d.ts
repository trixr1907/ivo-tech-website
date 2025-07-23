import { SVGProps } from 'react';

export interface SVGAttributes extends SVGProps<SVGElement> {
  width?: number | string;
  height?: number | string;
  viewBox?: string;
  xmlns?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeOpacity?: number;
  fillOpacity?: number;
  opacity?: number;
  transform?: string;
}

export interface PathAttributes extends SVGAttributes {
  d?: string;
  pathLength?: number;
}

export interface CircleAttributes extends SVGAttributes {
  cx?: number | string;
  cy?: number | string;
  r?: number | string;
}

export interface RectAttributes extends SVGAttributes {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  rx?: number | string;
  ry?: number | string;
}

export interface EllipseAttributes extends SVGAttributes {
  cx?: number | string;
  cy?: number | string;
  rx?: number | string;
  ry?: number | string;
}

export interface LineAttributes extends SVGAttributes {
  x1?: number | string;
  y1?: number | string;
  x2?: number | string;
  y2?: number | string;
}

export interface PolylineAttributes extends SVGAttributes {
  points?: string;
}

export interface PolygonAttributes extends SVGAttributes {
  points?: string;
}

export interface TextAttributes extends SVGAttributes {
  x?: number | string;
  y?: number | string;
  dx?: number | string;
  dy?: number | string;
  rotate?: number | string;
  textLength?: number | string;
  lengthAdjust?: 'spacing' | 'spacingAndGlyphs';
}

export interface SVGGroupAttributes extends SVGAttributes {
  transform?: string;
}

export interface SVGDefsAttributes extends SVGAttributes {}

export interface SVGUseAttributes extends SVGAttributes {
  href?: string;
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
}

export interface SVGSymbolAttributes extends SVGAttributes {
  viewBox?: string;
  preserveAspectRatio?: string;
}

export interface SVGMaskAttributes extends SVGAttributes {
  maskUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  maskContentUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
}

export interface SVGClipPathAttributes extends SVGAttributes {
  clipPathUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
}

export interface SVGFilterAttributes extends SVGAttributes {
  filterUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  primitiveUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
}

// Common SVG filter effect attributes
export interface SVGFilterEffectAttributes extends SVGAttributes {
  in?: string;
  in2?: string;
  result?: string;
}

export interface SVGGradientAttributes extends SVGAttributes {
  gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  gradientTransform?: string;
  spreadMethod?: 'pad' | 'reflect' | 'repeat';
}

export interface SVGStopAttributes extends SVGAttributes {
  offset?: number | string;
  stopColor?: string;
  stopOpacity?: number;
}

// Helper type for components that accept SVG attributes
export type SVGComponent<P = {}> = React.ComponentType<P & SVGAttributes>;
