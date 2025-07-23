import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

expect.extend(toHaveNoViolations);

/**
 * Prüft die Komponente auf Barrierefreiheit nach WCAG-Richtlinien
 */
export async function testA11y(ui: ReactElement) {
  const { container } = render(ui);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

/**
 * Mock für den A11y Service
 */
export const mockA11yService = {
  notify: jest.fn(),
  notifyError: jest.fn(),
  focusElement: jest.fn(),
  addKeyboardNavigation: jest.fn(),
};

/**
 * Helper zum Simulieren von Keyboard-Events
 */
export function simulateKeyPress(element: HTMLElement, key: string) {
  const keyEvent = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(keyEvent);
}

/**
 * Prüft, ob ARIA-Attribute korrekt gesetzt sind
 */
export function checkAriaAttributes(element: HTMLElement, attributes: Record<string, string>) {
  Object.entries(attributes).forEach(([attr, value]) => {
    expect(element.getAttribute(`aria-${attr}`)).toBe(value);
  });
}

/**
 * Prüft die Fokus-Reihenfolge von interaktiven Elementen
 */
export function checkFocusOrder(elements: HTMLElement[]) {
  elements.forEach((element, index) => {
    element.focus();
    expect(document.activeElement).toBe(element);
  });
}
