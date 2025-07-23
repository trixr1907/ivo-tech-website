import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSection from '../../../components/ui/HeroSection';

jest.mock('../../../components/3d/AnimatedLogo4D', () => {
  return function MockAnimatedLogo() {
    return <div data-testid="mock-animated-logo">Mock 3D Logo</div>;
  };
});

describe('HeroSection', () => {
  it('renders hero content correctly', () => {
    render(<HeroSection />);
    
    // Überprüfe Hauptüberschrift
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Überprüfe Call-to-Action Button
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
  });

  it('handles CTA button click', () => {
    const mockScrollTo = jest.fn();
    window.scrollTo = mockScrollTo;

    render(<HeroSection />);
    
    const ctaButton = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(ctaButton);
    
    // Überprüfe Scroll-Verhalten
    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('renders 3D logo component', () => {
    render(<HeroSection />);
    
    // Überprüfe, ob 3D Logo gerendert wird
    expect(screen.getByTestId('mock-animated-logo')).toBeInTheDocument();
  });

  it('animates content on mount', () => {
    render(<HeroSection />);
    
    const heroContent = screen.getByTestId('hero-content');
    
    // Überprüfe Animation-Klassen
    expect(heroContent).toHaveClass('animate-fadeIn');
  });
});
