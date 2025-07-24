interface PaintRenderingContext2D extends CanvasRenderingContext2D {
  // Additional Paint Worklet specific properties
}

interface PaintSize {
  width: number;
  height: number;
}

interface StylePropertyMapReadonly {
  get(name: string): CSSStyleValue;
  getAll(name: string): CSSStyleValue[];
  has(name: string): boolean;
  readonly size: number;
}

interface PaintWorkletGlobalScope {
  registerPaint(name: string, paintCtor: {
    new(): {
      paint(
        ctx: PaintRenderingContext2D,
        size: PaintSize,
        properties: StylePropertyMapReadonly
      ): void;
    };
  }): void;
  devicePixelRatio: number;
}
