import React from 'react';
import { render, act } from '@testing-library/react';
import AdvancedRenderer, { qualityPresets } from '../AdvancedRenderer';
import * as THREE from 'three';

// Mock für Three.js
jest.mock('three', () => ({
  ...jest.requireActual('three'),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setPixelRatio: jest.fn(),
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    shadowMap: {
      enabled: false,
      type: null
    },
    outputEncoding: null,
    toneMapping: null,
    toneMappingExposure: 1.0,
    physicallyCorrectLights: false
  }))
}));

// Mock für @react-three/fiber
jest.mock('@react-three/fiber', () => ({
  useThree: () => ({
    gl: new THREE.WebGLRenderer(),
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    size: { width: 1920, height: 1080 }
  }),
  useFrame: (callback: (state: any, delta: number) => void) => {
    callback({}, 0.016);
  }
}));

describe('AdvancedRenderer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default settings', () => {
    const { container } = render(<AdvancedRenderer />);
    expect(container).toBeTruthy();
  });

  it('should apply quality presets correctly', () => {
    // Teste alle Qualitätspresets
    Object.entries(qualityPresets).forEach(([quality, settings]) => {
      const startTime = performance.now();
      
      act(() => {
        render(<AdvancedRenderer {...settings} />);
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`Quality '${quality}' render time: ${renderTime}ms`);
      expect(renderTime).toBeLessThan(100); // Sollte unter 100ms sein
    });
  });

  it('should handle renderer configuration changes', () => {
    const renderer = new THREE.WebGLRenderer();
    const mockSetPixelRatio = jest.spyOn(renderer, 'setPixelRatio');

    act(() => {
      render(
        <AdvancedRenderer
          enableFXAA={true}
          enableBloom={true}
          enableSSAO={true}
          enableSSR={true}
          enableTAA={true}
          bloomSettings={{
            strength: 2.0,
            radius: 0.6,
            threshold: 0.75
          }}
        />
      );
    });

    expect(mockSetPixelRatio).toHaveBeenCalled();
  });

  // Performance Tests für verschiedene Szenarien
  it('should maintain performance with multiple effects', () => {
    const testCases = [
      { name: 'Basic', effects: { enableFXAA: true } },
      { name: 'Medium', effects: { enableFXAA: true, enableBloom: true } },
      { name: 'Complex', effects: { enableFXAA: true, enableBloom: true, enableSSAO: true } },
      { name: 'Full', effects: { enableFXAA: true, enableBloom: true, enableSSAO: true, enableSSR: true, enableTAA: true } }
    ];

    testCases.forEach(({ name, effects }) => {
      const startTime = performance.now();
      
      act(() => {
        render(<AdvancedRenderer {...effects} />);
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`${name} setup render time: ${renderTime}ms`);
      expect(renderTime).toBeLessThan(150); // Komplexere Setups dürfen etwas länger brauchen
    });
  });

  // Edge Cases
  it('should handle extreme settings gracefully', () => {
    const extremeSettings = {
      enableFXAA: true,
      enableBloom: true,
      bloomSettings: {
        strength: 1000, // Extremer Wert
        radius: 100,    // Extremer Wert
        threshold: 0.001 // Extremer Wert
      },
      ssaoSettings: {
        kernelRadius: 1000, // Extremer Wert
        minDistance: 0.0001,
        maxDistance: 1000
      }
    };

    expect(() => {
      render(<AdvancedRenderer {...extremeSettings} />);
    }).not.toThrow();
  });
});
