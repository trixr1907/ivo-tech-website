import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import type { MaterialProps } from '../../types/three-definitions';

interface Enhanced3DModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  materialProps?: MaterialProps;
  animations?: {
    autoPlay?: boolean;
    clipName?: string;
    loop?: THREE.LoopRepeat | THREE.LoopOnce | THREE.LoopPingPong;
    timeScale?: number;
  };
  physics?: {
    mass?: number;
    friction?: number;
    restitution?: number;
  };
  shadows?: {
    cast?: boolean;
    receive?: boolean;
  };
  interactions?: {
    onClick?: (event: THREE.Event) => void;
    onHover?: (event: THREE.Event) => void;
    onDrag?: (event: THREE.Event) => void;
  };
  performance?: {
    lod?: boolean;
    frustumCulling?: boolean;
    instanceable?: boolean;
  };
}

export const Enhanced3DModel: React.FC<Enhanced3DModelProps> = ({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  materialProps,
  animations,
  physics,
  shadows = { cast: true, receive: true },
  interactions,
  performance = {
    lod: true,
    frustumCulling: true,
    instanceable: false
  }
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations: modelAnimations } = useGLTF(url);
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));

  // Scale-Handling
  const scaleArray = typeof scale === 'number' ? [scale, scale, scale] : scale;

  // Material-Anwendung
  useEffect(() => {
    if (scene && materialProps) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => {
              if (material) {
                Object.assign(material, materialProps);
              }
            });
          } else if (mesh.material) {
            Object.assign(mesh.material, materialProps);
          }
        }
      });
    }
  }, [scene, materialProps]);

  // Animations-Setup
  useEffect(() => {
    if (animations?.autoPlay && animations.clipName) {
      const clip = modelAnimations.find((a) => a.name === animations.clipName);
      if (clip) {
        const action = mixer.clipAction(clip);
        if (animations.loop) action.setLoop(animations.loop);
        if (animations.timeScale) action.setEffectiveTimeScale(animations.timeScale);
        action.play();
      }
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [animations, mixer, modelAnimations]);

  // Animation-Update
  useFrame((_, delta) => {
    mixer.update(delta);
  });

  // Performance-Optimierungen
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.frustumCulled = performance.frustumCulling;

          if (performance.lod && mesh.geometry.boundingSphere) {
            const distance = mesh.geometry.boundingSphere.radius * 2;
            mesh.geometry.setDrawRange(0, distance > 100 ? distance / 2 : distance);
          }
        }
      });
    }
  }, [scene, performance]);

  return (
    <primitive
      ref={groupRef}
      object={scene}
      position={position}
      rotation={rotation}
      scale={scaleArray}
      onClick={interactions?.onClick}
      onPointerOver={(event) => {
        document.body.style.cursor = 'pointer';
        interactions?.onHover?.(event);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
      onPointerMove={interactions?.onDrag}
      castShadow={shadows.cast}
      receiveShadow={shadows.receive}
    />
  );
};

export default Enhanced3DModel;
