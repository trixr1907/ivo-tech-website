// Tree-shaking Optimierungen für Three.js und React Three Fiber

// Spezifische Three.js Imports statt full import
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
  Matrix4,
  Quaternion,
  AdditiveBlending,
  DoubleSide,
  Color,
} from 'three';

// Minimale R3F Imports
export { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';

export {
  OrbitControls,
  Stars,
  Float,
  Text,
  Instances,
  Instance,
} from '@react-three/drei';

// Conditional imports für Development vs Production
export const getThreeExtensions = () => {
  if (process.env.NODE_ENV === 'development') {
    return import(/* webpackChunkName: "three-dev-tools" */ 'three').then(
      () => null
    ); // Vereinfacht für Build-Kompatibilität
  }
  return Promise.resolve(null);
};

// Dynamic imports für schwere Features
export const getAdvanced3D = () => {
  return Promise.resolve({ default: () => null }); // Placeholder für Advanced 3D Features
};

export const getPostProcessing = () => {
  return import(
    /* webpackChunkName: "post-processing" */ '@react-three/postprocessing'
  ).catch(() => ({
    default: () => null,
  })); // Graceful fallback
};
