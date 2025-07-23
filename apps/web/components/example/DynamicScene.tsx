import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useIsomorphicLayoutEffect } from '../../types/react-event-types';
import { ThreeEvent, MaterialProps } from '../../types/three-types';
import { LoaderOptions, GLTFResult } from '../../types/loader-types';
import { SVGAttributes } from '../../types/svg-types';
import { NextDynamicProps } from '../../types/next-types';
import { loadGLTF, setupLoaders } from '../../utils/loaders';

// Dynamically import Three.js components
const Scene = dynamic(() => import('../three/Scene'), {
  ssr: false,
  loading: () => <div>Loading Scene...</div>
});

const Model = dynamic(() => import('../three/Model'), {
  ssr: false,
  loading: () => <div>Loading Model...</div>
});

interface DynamicSceneProps extends NextDynamicProps {
  modelUrl: string;
  backgroundColor?: string;
  onSceneLoad?: () => void;
}

const DynamicScene: React.FC<DynamicSceneProps> = ({
  modelUrl,
  backgroundColor = '#000000',
  onSceneLoad,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState<GLTFResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useIsomorphicLayoutEffect(() => {
    if (containerRef.current) {
      // Container setup logic here
    }
  }, []);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loaderOptions: LoaderOptions = {
          draco: {
            decoderPath: '/draco/',
            workerLimit: 2
          },
          ktx2: {
            transcoderPath: '/ktx2/'
          }
        };

        const gltf = await loadGLTF(modelUrl, loaderOptions);
        setModel(gltf);
        setIsLoading(false);
        onSceneLoad?.();
      } catch (error) {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    };

    loadModel();
  }, [modelUrl, onSceneLoad]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    console.log('Clicked position:', event.point);
  };

  const materialProps: MaterialProps = {
    color: '#ffffff',
    metalness: 0.5,
    roughness: 0.5,
    transparent: true,
    opacity: 0.8
  };

  const svgOverlayProps: SVGAttributes = {
    width: '100%',
    height: '100%',
    style: { position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Scene backgroundColor={backgroundColor}>
        {model && (
          <Model
            gltf={model}
            onClick={handleClick}
            materialProps={materialProps}
          />
        )}
        {children}
      </Scene>
      <svg {...svgOverlayProps}>
        {/* SVG overlay elements can be added here */}
      </svg>
    </div>
  );
};

export default DynamicScene;
