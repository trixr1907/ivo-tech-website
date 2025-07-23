import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { MaterialProps, StandardMaterialProps, ShaderMaterialProps } from '../../../types/three-types';

interface MaterialManagerProps {
  materials: {
    [key: string]: MaterialProps | StandardMaterialProps | ShaderMaterialProps;
  };
  onMaterialsReady?: (materials: { [key: string]: THREE.Material }) => void;
}

const MaterialManager: React.FC<MaterialManagerProps> = ({
  materials,
  onMaterialsReady
}) => {
  const { gl } = useThree();

  const processedMaterials = useMemo(() => {
    const result: { [key: string]: THREE.Material } = {};

    Object.entries(materials).forEach(([key, props]) => {
      if ('vertexShader' in props && 'fragmentShader' in props) {
        // Shader Material
        result[key] = new THREE.ShaderMaterial({
          ...props,
          uniforms: props.uniforms || {},
        });
      } else if ('roughness' in props || 'metalness' in props) {
        // Standard Material
        result[key] = new THREE.MeshStandardMaterial(props);
      } else {
        // Basic Material
        result[key] = new THREE.MeshBasicMaterial(props);
      }

      // Configure common material properties
      if (result[key]) {
        result[key].needsUpdate = true;
        
        if ('envMap' in props && props.envMap) {
          (result[key] as THREE.MeshStandardMaterial).envMap = props.envMap;
        }
        
        if ('map' in props && props.map) {
          (result[key] as THREE.MeshStandardMaterial).map = props.map;
        }
      }
    });

    return result;
  }, [materials]);

  useEffect(() => {
    // Dispose materials when component unmounts
    return () => {
      Object.values(processedMaterials).forEach(material => {
        if (material.dispose) {
          material.dispose();
        }
      });
    };
  }, [processedMaterials]);

  useEffect(() => {
    onMaterialsReady?.(processedMaterials);
  }, [processedMaterials, onMaterialsReady]);

  return null; // This is a utility component that doesn't render anything
};

export default MaterialManager;

// Helper functions for material creation
export const createStandardMaterial = (props: StandardMaterialProps): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial(props);
};

export const createShaderMaterial = (props: ShaderMaterialProps): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial(props);
};

// Custom hooks for material management
export const useMaterial = (props: MaterialProps) => {
  return useMemo(() => {
    if ('vertexShader' in props && 'fragmentShader' in props) {
      return createShaderMaterial(props as ShaderMaterialProps);
    } else if ('roughness' in props || 'metalness' in props) {
      return createStandardMaterial(props as StandardMaterialProps);
    } else {
      return new THREE.MeshBasicMaterial(props);
    }
  }, [props]);
};

// Example shader material
export const createCustomShaderMaterial = (uniforms: { [key: string]: THREE.IUniform }) => {
  return {
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        vec3 color = vec3(vUv.x, vUv.y, sin(time));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms,
  };
};
