'use client';

import { useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { isLowEndDevice } from '../lib/utils';

interface AssetQuality {
  resolution: 'low' | 'medium' | 'high';
  textureCompression: 'ktx2' | 'jpg' | 'png';
  geometryCompression: boolean;
}

interface LoaderOptions {
  quality: AssetQuality;
  progressive: boolean;
  priority: number;
  cached: boolean;
}

export function useOptimizedAssets(
  modelPath: string,
  options: Partial<LoaderOptions> = {}
) {
  const [quality, setQuality] = useState<AssetQuality>({
    resolution: 'high',
    textureCompression: 'ktx2',
    geometryCompression: true,
  });

  // Automatische Qualitätsanpassung
  useEffect(() => {
    const detectOptimalQuality = async () => {
      const isLowEnd = isLowEndDevice();
      const hasWebGL2 = 'WebGL2RenderingContext' in window;

      setQuality({
        resolution: isLowEnd ? 'low' : 'high',
        textureCompression: hasWebGL2 ? 'ktx2' : 'jpg',
        geometryCompression: true,
      });
    };

    detectOptimalQuality();
  }, []);

  // Optimierter GLTF Loader
  const gltfLoader = new GLTFLoader();

  // DRACO Kompression
  if (quality.geometryCompression) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    gltfLoader.setDRACOLoader(dracoLoader);
  }

  // KTX2 Textur-Kompression
  if (quality.textureCompression === 'ktx2') {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath('/basis/');
    gltfLoader.setKTX2Loader(ktx2Loader);
  }

  // Progressive Loading
  if (options.progressive) {
    gltfLoader.setRequestHeader({
      'Accept-Encoding': 'gzip, br',
      'X-Progressive-Load': 'true',
    });
  }

  // Asset Loading mit Qualitätsanpassung
  const getOptimizedPath = (path: string): string => {
    const [base, ext] = path.split('.');
    if (quality.resolution === 'low') {
      return `${base}_low.${ext}`;
    }
    return path;
  };

  // Hook-Return mit optimiertem Loader
  return {
    loader: gltfLoader,
    quality,
    load: (path: string) =>
      useLoader(GLTFLoader, getOptimizedPath(path), loader => {
        loader.setCrossOrigin('anonymous');
        return {
          ...options,
          quality: quality,
        };
      }),
  };
}
