import * as THREE from 'three';

export const { Color, DoubleSide: SIDES, MathUtils } = THREE;

// Re-export common utilities
export const radToDeg = (rad: number) => (rad * 180) / Math.PI;
export const degToRad = (deg: number) => (deg * Math.PI) / 180;

// Add helper functions if needed
export const lerp = (start: number, end: number, t: number) =>
  start * (1 - t) + end * t;
