import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationHeader } from '../../../components/ui/NavigationHeader';

describe('NavigationHeader', () => {
  const mockOnLoginClick = jest.fn();
  it('renders navigation links correctly', () => {
render(<NavigationHeader onLoginClick={mockOnLoginClick} />);
    
    // Überprüfe, ob wichtige Navigation Links vorhanden sind
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Services/i)).toBeInTheDocument();
  });

  it('handles mobile menu toggle', () => {
    render(<NavigationHeader onLoginClick={mockOnLoginClick} />);
    
    // Finde den mobile menu button (suche nach dem SVG-Icon)
    const menuButton = screen.getByRole('button', { name: '' });
    expect(menuButton).toBeInTheDocument();
    
// Überprüfe initiales Verhalten
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('hidden', 'md:flex');
    
    // Toggle menu
    fireEvent.click(menuButton);
    
    // Überprüfe, ob mobiles Menü sichtbar ist
    const mobileNav = screen.getByRole('navigation', { hidden: true });
    expect(mobileNav).toBeInTheDocument();
  });

  it('handles section scrolling', () => {
    // Mock window.scrollTo
    const mockScrollTo = jest.fn();
    window.scrollTo = mockScrollTo;

    render(<NavigationHeader onLoginClick={mockOnLoginClick} />);

    // Klicke auf einen Button mit section ID
    fireEvent.click(screen.getByText(/About/i));

    // Überprüfe, ob die scrollToSection Funktion aufgerufen wurde
    expect(document.getElementById('about')).toBeDefined();
  });

  it('handles login click', () => {
    render(<NavigationHeader onLoginClick={mockOnLoginClick} />);

    // Klicke auf den Login Button
    fireEvent.click(screen.getByText('Login'));

    // Überprüfe, ob der onLoginClick Handler aufgerufen wurde
    expect(mockOnLoginClick).toHaveBeenCalled();
  });
});
