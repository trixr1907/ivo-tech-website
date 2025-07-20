import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnimatedLogo4DShowcase } from '../../../components/3d/AnimatedLogo4D.example';

/**
 * Test Suite für AnimatedLogo4D Showcase Komponente
 */
describe('AnimatedLogo4DShowcase', () => {
  it('renders without crashing', () => {
    const { container } = render(<AnimatedLogo4DShowcase />);
    expect(container).toBeInTheDocument();
  });

  it('includes multiple themes in showcasing', () => {
    const { getByText } = render(<AnimatedLogo4DShowcase />);
    expect(getByText(/Enterprise Neon Hologram \(Standard\)/i)).toBeInTheDocument();
    expect(getByText(/High Performance \(30fps, reduzierte Effekte\)/i)).toBeInTheDocument();
    expect(getByText(/Mobile Optimized \(kleine Größe\)/i)).toBeInTheDocument();
    expect(getByText(/Minimal \(nur Logo, keine Effekte\)/i)).toBeInTheDocument();
  });

  it('displays interactive component controls', () => {
    const { getByLabelText } = render(<AnimatedLogo4DShowcase />);
    expect(getByLabelText(/Größe/i)).toBeInTheDocument();
    expect(getByLabelText(/FPS Limit/i)).toBeInTheDocument();
    expect(getByLabelText(/Theme/i)).toBeInTheDocument();
    expect(getByLabelText(/Partikel/i)).toBeInTheDocument();
    expect(getByLabelText(/Scan Lines/i)).toBeInTheDocument();
    expect(getByLabelText(/Time Morphing/i)).toBeInTheDocument();
  });
});
