import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { MaterialProps, GLTFResult } from '../../types/three-types';

interface ModelLoaderProps {
  url: string;
  draco?: boolean;
  dracoPath?: string;
  onLoad?: (model: THREE.Group) => void;
  onProgress?: (event: ProgressEvent) => void;
  onError?: (error: Error) => void;
  materialProps?: MaterialProps;
}

interface LoaderState {
  model: THREE.Group | null;
  isLoading: boolean;
  error: Error | null;
  progress: number;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({
  url,
  draco = false,
  dracoPath = '/draco/',
  onLoad,
  onProgress,
  onError,
  materialProps
}) => {
  const [state, setState] = useState<LoaderState>({
    model: null,
    isLoading: true,
    error: null,
    progress: 0
  });

  useEffect(() => {
    const loader = new GLTFLoader();

    if (draco) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(dracoPath);
      loader.setDRACOLoader(dracoLoader);
    }

    loader.load(
      url,
      (gltf: GLTFResult) => {
        const model = gltf.scene;

        if (materialProps) {
          model.traverse((child) => {
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

        setState({
          model,
          isLoading: false,
          error: null,
          progress: 100
        });

        onLoad?.(model);
      },
(event: ProgressEvent) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setState(prev => ({
            ...prev,
            progress
          }));
        }
        onProgress?.(event);
      },
(error: Error) => {
        console.error('Error loading model:', error);
        setState({
          model: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error(String(error)),
          progress: 0
        });
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    );

    return () => {
      // Cleanup
      if (state.model) {
        state.model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry) {
              mesh.geometry.dispose();
            }
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((material) => material?.dispose());
            } else if (mesh.material) {
              mesh.material.dispose();
            }
          }
        });
      }
    };
  }, [url, draco, dracoPath, onLoad, onProgress, onError, materialProps]);

  if (state.error) {
    return (
      <div className="error-container">
        <h3>Fehler beim Laden des Modells</h3>
        <p>{state.error.message}</p>
      </div>
    );
  }

  return state.model ? <group>{state.model}</group> : null;
};

export default ModelLoader;
