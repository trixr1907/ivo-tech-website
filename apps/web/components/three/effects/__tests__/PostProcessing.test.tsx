import React from 'react';
import { render, act } from '@testing-library/react';
import PostProcessing, { effectPresets } from '../PostProcessing';
import { BlendFunction } from 'postprocessing';

// Mock für @react-three/fiber
jest.mock('@react-three/fiber', () => ({
  useThree: () => ({
    gl: {},
    size: { width: 1920, height: 1080 },
    scene: {},
    camera: {}
  }),
  useFrame: (callback: (state: any, delta: number) => void) => {
    // Simuliere einen Frame-Update
    callback({}, 0.016);
  }
}));

// Mock für @react-three/postprocessing
jest.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: { children: React.ReactNode }) => <div data-testid="effect-composer">{children}</div>,
  Bloom: () => <div data-testid="bloom-effect" />,
  ChromaticAberration: () => <div data-testid="chromatic-aberration-effect" />,
  DepthOfField: () => <div data-testid="depth-of-field-effect" />,
  DotScreen: () => <div data-testid="dot-screen-effect" />,
  Glitch: () => <div data-testid="glitch-effect" />,
  Noise: () => <div data-testid="noise-effect" />,
  Pixelation: () => <div data-testid="pixelation-effect" />,
  SMAA: () => <div data-testid="smaa-effect" />,
  SSAO: () => <div data-testid="ssao-effect" />,
  Vignette: () => <div data-testid="vignette-effect" />
}));

describe('PostProcessing Component', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(<PostProcessing />);
    expect(getByTestId('effect-composer')).toBeInTheDocument();
    expect(getByTestId('smaa-effect')).toBeInTheDocument();
  });

  it('should not render when disabled', () => {
    const { container } = render(<PostProcessing enabled={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render cinematic preset correctly', () => {
    const { getByTestId } = render(
      <PostProcessing
        enabled={true}
        effects={effectPresets.cinematic}
      />
    );

    expect(getByTestId('bloom-effect')).toBeInTheDocument();
    expect(getByTestId('chromatic-aberration-effect')).toBeInTheDocument();
    expect(getByTestId('vignette-effect')).toBeInTheDocument();
  });

  it('should render horror preset correctly', () => {
    const { getByTestId } = render(
      <PostProcessing
        enabled={true}
        effects={effectPresets.horror}
      />
    );

    expect(getByTestId('chromatic-aberration-effect')).toBeInTheDocument();
    expect(getByTestId('glitch-effect')).toBeInTheDocument();
    expect(getByTestId('noise-effect')).toBeInTheDocument();
    expect(getByTestId('vignette-effect')).toBeInTheDocument();
  });

  // Performance Tests
  it('should handle performance measurement', () => {
    const startTime = performance.now();
    
    act(() => {
      render(
        <PostProcessing
          enabled={true}
          effects={{
            bloom: {
              enabled: true,
              intensity: 1.5,
              luminanceThreshold: 0.9,
              luminanceSmoothing: 0.025
            },
            chromaticAberration: {
              enabled: true,
              offset: [0.002, 0.002]
            }
          }}
        />
      );
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Protokolliere die Performance-Metrik
    console.log(`Render time: ${renderTime}ms`);
    
    // Stelle sicher, dass die Renderzeit akzeptabel ist (z.B. unter 100ms)
    expect(renderTime).toBeLessThan(100);
  });

  // Edge Cases
  it('should handle extreme values gracefully', () => {
    expect(() => {
      render(
        <PostProcessing
          enabled={true}
          effects={{
            bloom: {
              enabled: true,
              intensity: 1000000, // Extremer Wert
              luminanceThreshold: 0,
              luminanceSmoothing: 1
            }
          }}
        />
      );
    }).not.toThrow();
  });
});
