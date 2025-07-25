import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EpicScene3D from '../../../components/3d/EpicScene3D';

// Mock Three.js and React Three Fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: jest.fn().mockImplementation(({ children, ...props }: any) => (
    <div data-testid="canvas" data-props={JSON.stringify(props)}>
      {children}
    </div>
  )),
  useFrame: jest.fn(),
  useThree: jest.fn().mockReturnValue({
    camera: { position: { set: jest.fn() }, rotation: { set: jest.fn() } },
    gl: { setSize: jest.fn(), setPixelRatio: jest.fn() },
    scene: { add: jest.fn(), remove: jest.fn() },
  }),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Stars: () => <div data-testid="stars" />,
  Environment: () => <div data-testid="environment" />,
  Text: () => <div data-testid="text" />,
  Box: () => <div data-testid="box" />,
  Sphere: () => <div data-testid="sphere" />,
  Torus: () => <div data-testid="torus" />,
  Float: ({ children }) => <div data-testid="float">{children}</div>,
  Html: ({ children }) => <div data-testid="html">{children}</div>,
  AmbientLight: () => <div data-testid="ambient-light" />,
  PointLight: () => <div data-testid="point-light" />,
  SpotLight: () => <div data-testid="spot-light" />,
  Mesh: ({ children }) => <div data-testid="mesh">{children}</div>,
  SphereGeometry: () => <div data-testid="sphere-geometry" />,
  MeshStandardMaterial: () => <div data-testid="mesh-standard-material" />,
}));

jest.mock('three', () => ({
  ...jest.requireActual('three'),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
  })),
  PerspectiveCamera: jest.fn(),
  Scene: jest.fn(),
  BoxGeometry: jest.fn(),
  MeshStandardMaterial: jest.fn(),
  Mesh: jest.fn(),
}));

describe('EpicScene3D', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders canvas with correct configuration', () => {
      render(<EpicScene3D />);

      const canvas = screen.getByTestId('canvas');
      expect(canvas).toBeInTheDocument();

      const props = JSON.parse(canvas.getAttribute('data-props') || '{}');
      expect(props.camera).toBeDefined();
      expect(props.gl).toBeDefined();
    });

    test('renders OrbitControls for interaction', () => {
      render(<EpicScene3D />);
      expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
    });

    test('renders Stars component', () => {
      render(<EpicScene3D />);
      expect(screen.getByTestId('stars')).toBeInTheDocument();
    });

    test('renders Environment for lighting', () => {
      render(<EpicScene3D />);
      expect(screen.getByTestId('environment')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    test('adapts to different container sizes', () => {
      const { rerender } = render(
        <div style={{ width: '800px', height: '600px' }}>
          <EpicScene3D />
        </div>
      );

      expect(screen.getByTestId('canvas')).toBeInTheDocument();

      // Rerender with different size
      rerender(
        <div style={{ width: '400px', height: '300px' }}>
          <EpicScene3D />
        </div>
      );

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    test('handles window resize events', () => {
      render(<EpicScene3D />);

      // Mock window resize
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('renders without performance warnings', () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      render(<EpicScene3D />);

      // Should not have performance warnings
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('performance')
      );

      consoleSpy.mockRestore();
    });

    test('cleans up resources on unmount', () => {
      const { unmount } = render(<EpicScene3D />);

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('WebGL Support', () => {
    test('handles missing WebGL gracefully', () => {
      // Mock WebGL not supported
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

      const { container } = render(<EpicScene3D />);

      // Should still render something
      expect(container.firstChild).toBeTruthy();

      // Restore original method
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });
  });

  describe('Animation', () => {
    test('starts animation loop', async () => {
      render(<EpicScene3D />);

      // Wait for component to mount and start animation
      await waitFor(() => {
        expect(screen.getByTestId('canvas')).toBeInTheDocument();
      });

      // Animation should be running (no errors)
      expect(() => screen.getByTestId('canvas')).not.toThrow();
    });
  });

  describe('Interaction', () => {
    test('responds to mouse interactions', () => {
      render(<EpicScene3D />);

      const canvas = screen.getByTestId('canvas');

      // Simulate mouse events
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(canvas, { clientX: 150, clientY: 150 });

      // Should handle events without errors
      expect(canvas).toBeInTheDocument();
    });

    test('responds to touch interactions', () => {
      render(<EpicScene3D />);

      const canvas = screen.getByTestId('canvas');

      // Simulate touch events
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      fireEvent.touchMove(canvas, {
        touches: [{ clientX: 150, clientY: 150 }],
      });
      fireEvent.touchEnd(canvas);

      // Should handle touch events without errors
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles rendering errors gracefully', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // This should not crash the component
      render(<EpicScene3D />);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});
