import React from 'react';
import { render, act } from '@testing-library/react';
import { Effects } from '../Effects';
import { BlendFunction } from 'postprocessing';

// Mock für @react-three/postprocessing
jest.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: { children: React.ReactNode }) => <div data-testid="effect-composer">{children}</div>,
  Bloom: (props: any) => <div data-testid="bloom-effect" data-props={JSON.stringify(props)} />,
  SMAA: () => <div data-testid="smaa-effect" />
}));

describe('Effects Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default props', () => {
    const { getByTestId } = render(<Effects />);
    expect(getByTestId('effect-composer')).toBeInTheDocument();
    expect(getByTestId('bloom-effect')).toBeInTheDocument();
    expect(getByTestId('smaa-effect')).toBeInTheDocument();
  });

  it('should not render any effects when all are disabled', () => {
    const { container } = render(
      <Effects
        enableBloom={false}
        enableGlow={false}
        fxaa={false}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should apply bloom settings correctly', () => {
    const bloomSettings = {
      bloomStrength: 0.8,
      bloomRadius: 0.6
    };

    const { getByTestId } = render(<Effects {...bloomSettings} />);
    const bloomEffect = getByTestId('bloom-effect');
    const props = JSON.parse(bloomEffect.getAttribute('data-props') || '{}');

    expect(props.intensity).toBe(bloomSettings.bloomStrength);
    expect(props.radius).toBe(bloomSettings.bloomRadius);
  });

  // Performance Tests
  it('should maintain performance with different configurations', () => {
    const testCases = [
      { name: 'Basic', props: { enableBloom: true, fxaa: true } },
      { name: 'With Glow', props: { enableBloom: true, enableGlow: true, fxaa: true } },
      { name: 'High Quality', props: { 
        enableBloom: true,
        enableGlow: true,
        bloomStrength: 0.8,
        bloomRadius: 0.6,
        glowStrength: 0.5,
        fxaa: true
      }}
    ];

    testCases.forEach(({ name, props }) => {
      const startTime = performance.now();
      
      act(() => {
        render(<Effects {...props} />);
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`${name} configuration render time: ${renderTime}ms`);
      expect(renderTime).toBeLessThan(100);
    });
  });

  // Edge Cases
  it('should handle extreme values gracefully', () => {
    const extremeSettings = {
      enableBloom: true,
      enableGlow: true,
      bloomStrength: 100,    // Extremer Wert
      bloomRadius: 1000,     // Extremer Wert
      glowStrength: 50       // Extremer Wert
    };

    expect(() => {
      render(<Effects {...extremeSettings} />);
    }).not.toThrow();
  });

  it('should handle rapid setting changes', () => {
    const { rerender } = render(<Effects enableBloom={true} bloomStrength={0.5} />);

    // Simuliere schnelle Änderungen der Einstellungen
    const iterations = 10;
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      act(() => {
        rerender(
          <Effects
            enableBloom={true}
            bloomStrength={Math.random()}
            bloomRadius={Math.random()}
          />
        );
      });
    }

    const endTime = performance.now();
    const averageUpdateTime = (endTime - startTime) / iterations;
    
    console.log(`Average update time: ${averageUpdateTime}ms`);
    expect(averageUpdateTime).toBeLessThan(50); // Sollte schnell genug sein
  });
});
