import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TechShowcase } from '../../../components/ui/TechShowcase';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    h2: 'h2',
    p: 'p',
    button: 'button',
  },
}));

describe('TechShowcase', () => {
  it('renders without crashing', () => {
    render(<TechShowcase />);
    expect(screen.getByText('Unsere Technologien')).toBeInTheDocument();
  });

  it('displays all technologies by default', () => {
    render(<TechShowcase />);
    expect(screen.getByText('React & Next.js')).toBeInTheDocument();
    expect(screen.getByText('Three.js')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('filters technologies by category', () => {
    render(<TechShowcase />);
    
    // Click on Frontend filter
    fireEvent.click(screen.getByText(/Frontend/));
    
    // Frontend technologies should be visible
    expect(screen.getByText('React & Next.js')).toBeInTheDocument();
    expect(screen.getByText('TailwindCSS')).toBeInTheDocument();
    
    // Backend technologies should not be visible
    expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
  });

  it('shows all technologies when "Alle" is clicked', () => {
    render(<TechShowcase />);
    
    // First click on Frontend to filter
    fireEvent.click(screen.getByText(/Frontend/));
    
    // Then click on "Alle" to show all
    fireEvent.click(screen.getByText('Alle'));
    
    // All technologies should be visible again
    expect(screen.getByText('React & Next.js')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Three.js')).toBeInTheDocument();
  });

  it('changes technology card style on hover', () => {
    const { container } = render(<TechShowcase />);
    
    // Find first technology card
    const firstCard = container.querySelector('.relative.p-6.rounded-xl');
    expect(firstCard).toBeInTheDocument();
    
    // Simulate hover
    fireEvent.mouseEnter(firstCard as Element);
    expect(firstCard).toHaveClass('bg-blue-500/10');
    
    // Simulate hover end
    fireEvent.mouseLeave(firstCard as Element);
    expect(firstCard).toHaveClass('bg-gray-800/50');
  });

  it('renders all category filter buttons', () => {
    render(<TechShowcase />);
    
    const categories = [
      'Alle',
      'Frontend',
      'Backend',
      '3D & WebGL',
      'Tools',
      'Sprachen'
    ];
    
    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });
});
