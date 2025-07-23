import { ReactNode, RefObject, MutableRefObject } from 'react';
import { ColorRepresentation, Material, BufferGeometry } from 'three';

declare global {
  // React Types
  namespace React {
    interface ReactElement {
      type: any;
      props: any;
      key: string | null;
    }
  }

  // Three.js Types
  interface ThreeElements {
    primitive: Object3DProps;
    mesh: MeshProps;
    points: PointsProps;
    group: GroupProps;
    lineSegments: LineSegmentsProps;
    sprite: SpriteProps;
    scene: Object3DProps;
  }

  interface MaterialProps {
    color?: ColorRepresentation;
    transparent?: boolean;
    opacity?: number;
    side?: number;
    // Add other common material properties
  }

  interface MeshProps extends Object3DProps {
    material?: Material | Material[];
    geometry?: BufferGeometry;
  }

  interface Object3DProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    visible?: boolean;
    // Add other common Object3D properties
  }
}

export {};
