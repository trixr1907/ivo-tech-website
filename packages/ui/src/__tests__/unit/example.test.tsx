import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Hier würden Sie Ihre zu testende Komponente importieren
// import { Button } from '@/components/Button';

describe('Button Component', () => {
  it('should render with correct text', () => {
    // Beispiel für einen einfachen Render-Test
    render(<button>Click me</button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    render(<button onClick={handleClick}>Click me</button>);

    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
