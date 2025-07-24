import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ServicesSection } from '../../../components/ui/ServicesSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    h2: 'h2',
    p: 'p',
    ul: 'ul',
    li: 'li',
    button: 'button',
  },
}));

describe('ServicesSection', () => {
  it('renders without crashing', () => {
    render(<ServicesSection />);
    expect(screen.getByText('Unsere Services')).toBeInTheDocument();
  });

  it('displays all services', () => {
    render(<ServicesSection />);
    
    const services = [
      'Webentwicklung',
      'Heimserver-Setup',
      'IT-Beratung',
      'Automatisierung'
    ];
    
    services.forEach(service => {
      expect(screen.getByText(service)).toBeInTheDocument();
    });
  });

  it('shows correct features for each service', () => {
    render(<ServicesSection />);
    
    // Check Webentwicklung features
    expect(screen.getByText('Responsive Design')).toBeInTheDocument();
    expect(screen.getByText('SEO-Optimiert')).toBeInTheDocument();
    expect(screen.getByText('Performance-Fokus')).toBeInTheDocument();
    expect(screen.getByText('Mobile-First')).toBeInTheDocument();
    
    // Check Heimserver-Setup features
    expect(screen.getByText('Proxmox Installation')).toBeInTheDocument();
    expect(screen.getByText('Docker Services')).toBeInTheDocument();
    expect(screen.getByText('Backup-Systeme')).toBeInTheDocument();
    expect(screen.getByText('Monitoring')).toBeInTheDocument();
  });

  it('displays prices correctly', () => {
    render(<ServicesSection />);
    
    expect(screen.getByText('Ab 1.299€')).toBeInTheDocument();
    expect(screen.getByText('Ab 399€')).toBeInTheDocument();
    expect(screen.getByText('95€/h')).toBeInTheDocument();
    expect(screen.getByText('Ab 249€')).toBeInTheDocument();
  });

  it('shows additional info section', () => {
    render(<ServicesSection />);
    
    expect(screen.getByText('💡 Kostenlose Erstberatung (30 Min.)')).toBeInTheDocument();
    expect(screen.getByText('🔧 Wartung und Support verfügbar')).toBeInTheDocument();
    expect(screen.getByText('⚡ Schnelle Umsetzung - meist innerhalb weniger Wochen')).toBeInTheDocument();
  });

  it('changes service card style on hover', () => {
    const { container } = render(<ServicesSection />);
    
    // Find first service card
    const serviceCards = container.querySelectorAll('.rounded-lg.border');
    const firstCard = serviceCards[0];
    
    // Initial state
    expect(firstCard).toHaveClass('bg-gray-800/30');
    
    // Simulate hover
    fireEvent.mouseEnter(firstCard);
    expect(firstCard).toHaveClass('bg-blue-500/10');
    
    // Simulate hover end
    fireEvent.mouseLeave(firstCard);
    expect(firstCard).toHaveClass('bg-gray-800/30');
  });

  it('renders all service action buttons', () => {
    render(<ServicesSection />);
    
    const actionButtons = screen.getAllByText('Anfrage stellen');
    expect(actionButtons).toHaveLength(4); // We have 4 services
    
    actionButtons.forEach(button => {
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });
});
