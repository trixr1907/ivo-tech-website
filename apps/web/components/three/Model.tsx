import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFResult, MaterialProps, ThreeEvent } from '../../types/three-types';

interface ModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  materialProps?: MaterialProps;
  animate?: boolean;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerOut?: (event: ThreeEvent<MouseEvent>) => void;
}

const Model: React.FC<ModelProps> = ({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  materialProps,
  animate = false,
  onClick,
  onPointerOver,
  onPointerOut
}) => {
  const modelRef = useRef<THREE.Group>(null);
  const { scene: model } = useGLTF(url) as GLTFResult;
  const scaleValue = Array.isArray(scale) ? scale : [scale, scale, scale];

  useEffect(() => {
    if (modelRef.current && materialProps) {
      modelRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            if (material) Object.assign(material, materialProps);
          });
        } else if (mesh.material) {
          Object.assign(mesh.material, materialProps);
        }
      }
      });
    }
  }, [materialProps]);

  useFrame((state, delta) => {
    if (animate && modelRef.current) {
      // Example animation - rotate the model
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick?.(event);
  };

  const handlePointerOver = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (modelRef.current) {
      document.body.style.cursor = 'pointer';
    }
    onPointerOver?.(event);
  };

  const handlePointerOut = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (modelRef.current) {
      document.body.style.cursor = 'default';
    }
    onPointerOut?.(event);
  };

  return (
    <primitive
      ref={modelRef}
      object={model}
      position={position}
      rotation={rotation}
      scale={scaleValue}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
    />
  );
};

export default Model;
