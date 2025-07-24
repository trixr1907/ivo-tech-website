import { ThreeElements } from '@react-three/fiber';
import { RefAttributes } from 'react';

declare module '@react-three/fiber/jsx-runtime' {
  export * from '@react-three/fiber';
}

declare module '@react-three/fiber' {
  interface BaseProps {
    attach?: string;
    args?: any[];
    children?: React.ReactNode;
    ref?: React.Ref<any>;
  }

  interface Object3DProps extends BaseProps {
    position?: [number, number, number] | THREE.Vector3;
    rotation?: [number, number, number] | THREE.Euler;
    scale?: [number, number, number] | THREE.Vector3;
    up?: [number, number, number] | THREE.Vector3;
    matrix?: THREE.Matrix4;
    quaternion?: THREE.Quaternion;
    visible?: boolean;
    castShadow?: boolean;
    receiveShadow?: boolean;
    frustumCulled?: boolean;
    renderOrder?: number;
    name?: string;
    onUpdate?: (self: THREE.Object3D) => void;
  }

  interface MaterialProps extends BaseProps {
    color?: THREE.ColorRepresentation;
    opacity?: number;
    transparent?: boolean;
    side?: THREE.Side;
    needsUpdate?: boolean;
    toneMapped?: boolean;
    vertexColors?: boolean;
    visible?: boolean;
    wireframe?: boolean;
    size?: number;
  }

  interface MeshProps extends Object3DProps {
    material?: THREE.Material | THREE.Material[];
    geometry?: THREE.BufferGeometry;
  }

  interface PerspectiveCameraProps extends Object3DProps {
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
    zoom?: number;
  }

  interface OrthographicCameraProps extends Object3DProps {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    near?: number;
    far?: number;
    zoom?: number;
  }

  interface LightProps extends Object3DProps {
    intensity?: number;
    color?: THREE.ColorRepresentation;
    target?: THREE.Object3D;
    shadow?: THREE.LightShadow;
  }

  export interface ThreeElements {
    mesh: MeshProps;
    primitive: Object3DProps;
    pointLight: LightProps;
    hemisphereLight: LightProps;
    group: Object3DProps;
    line: Object3DProps;
    lineSegments: Object3DProps;
    points: Object3DProps;
    sprite: Object3DProps;
    skinnedMesh: MeshProps;
    instancedMesh: MeshProps;
    scene: Object3DProps;
    perspectiveCamera: PerspectiveCameraProps;
    orthographicCamera: OrthographicCameraProps;
    ambientLight: LightProps;
    directionalLight: LightProps;
    spotLight: LightProps;
    rectAreaLight: LightProps;
    fog: any;
    meshStandardMaterial: MaterialProps;
    meshBasicMaterial: MaterialProps;
    meshPhongMaterial: MaterialProps;
    meshLambertMaterial: MaterialProps;
    meshNormalMaterial: MaterialProps;
    meshDepthMaterial: MaterialProps;
    meshDistanceMaterial: MaterialProps;
    meshMatcapMaterial: MaterialProps;
    meshPhysicalMaterial: MaterialProps;
    meshToonMaterial: MaterialProps;
    lineBasicMaterial: MaterialProps;
    lineDashedMaterial: MaterialProps;
    pointsMaterial: MaterialProps;
    spriteMaterial: MaterialProps;
    shadowMaterial: MaterialProps;
    shaderMaterial: MaterialProps;
    rawShaderMaterial: MaterialProps;
    planeGeometry: BaseProps;
    boxGeometry: BaseProps;
    sphereGeometry: BaseProps;
    cylinderGeometry: BaseProps;
    coneGeometry: BaseProps;
    circleGeometry: BaseProps;
    ringGeometry: BaseProps;
    torusGeometry: BaseProps;
    torusKnotGeometry: BaseProps;
    dodecahedronGeometry: BaseProps;
    octahedronGeometry: BaseProps;
    tetrahedronGeometry: BaseProps;
    icosahedronGeometry: BaseProps;
    polyhedronGeometry: BaseProps;
    tubeGeometry: BaseProps;
    extrudeGeometry: BaseProps;
    latheGeometry: BaseProps;
    shapeGeometry: BaseProps;
    textGeometry: BaseProps;
    bufferGeometry: BaseProps;
    instancedBufferGeometry: BaseProps;
    bufferAttribute: BaseProps;
    float32BufferAttribute: BaseProps;
    float64BufferAttribute: BaseProps;
    int8BufferAttribute: BaseProps;
    int16BufferAttribute: BaseProps;
    int32BufferAttribute: BaseProps;
    uint8BufferAttribute: BaseProps;
    uint16BufferAttribute: BaseProps;
    uint32BufferAttribute: BaseProps;
    instancedBufferAttribute: BaseProps;
    interleavedBufferAttribute: BaseProps;
    interleavedBuffer: BaseProps;
    instancedInterleavedBuffer: BaseProps;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends Record<keyof ThreeElements, any> {}
  }
}
