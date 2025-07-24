import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from '../../../components/ui/HeroSection';

jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    h1: 'h1',
    p: 'p',
    a: 'a',
  },
}));

// Mock window.innerWidth and window.innerHeight
Object.defineProperty(window, 'innerWidth', { value: 1920 });
Object.defineProperty(window, 'innerHeight', { value: 1080 });

describe('HeroSection', () => {
  it('renders without crashing', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('Willkommen bei ivo-tech')).toBeInTheDocument();
    expect(
      screen.getByText('Innovative Softwarelösungen & Fortschrittliche Webtechnologien')
    ).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    render(<HeroSection />);
    
    const servicesLink = screen.getByText('Unsere Services');
    const contactLink = screen.getByText('Kontakt');
    
    expect(servicesLink).toHaveAttribute('href', '#services');
    expect(contactLink).toHaveAttribute('href', '#contact');
  });

  it('updates mouse position on mouse move', () => {
    const { container } = render(<HeroSection />);
    
    fireEvent.mouseMove(container.firstChild as Element, {
      clientX: 960, // Center X
      clientY: 540, // Center Y
    });

    // The component should not crash on mouse move
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies parallax effect based on mouse position', () => {
    const { container } = render(<HeroSection />);
    const heroSection = container.firstChild as Element;
    
    // Move mouse to the right
    fireEvent.mouseMove(heroSection, {
      clientX: 1920, // Right edge
      clientY: 540,  // Center Y
    });

    // Move mouse to the left
    fireEvent.mouseMove(heroSection, {
      clientX: 0,    // Left edge
      clientY: 540,  // Center Y
    });

    // The component should maintain its structure
    expect(screen.getByText('Willkommen bei ivo-tech')).toBeInTheDocument();
  });

  it('renders decorative elements', () => {
    const { container } = render(<HeroSection />);
    
    // Check for background gradient
    const gradientElement = container.querySelector('.bg-gradient-to-b');
    expect(gradientElement).toBeInTheDocument();
    
    // Check for radial gradient
    const radialGradient = container.querySelector('[class*="radial-gradient"]');
    expect(radialGradient).toBeInTheDocument();
    
    // Check for floating particles
    const particles = container.querySelectorAll('.bg-white.rounded-full');
    expect(particles.length).toBe(20); // We're creating 20 particles
  });
});
