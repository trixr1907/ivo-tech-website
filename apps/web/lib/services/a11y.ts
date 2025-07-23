/**
 * Accessibility Service für verbessertes Error-Handling
 */

interface A11yNotificationOptions {
  // ARIA live region Politik: 'polite' | 'assertive' | 'off'
  priority?: 'polite' | 'assertive';
  // Zeitdauer in MS, nach der die Nachricht entfernt wird (optional)
  timeout?: number;
  // Zusätzliche Rolle für Screen Reader
  role?: 'alert' | 'status' | 'log';
}

class A11yService {
  private static instance: A11yService;
  private container: HTMLDivElement | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeContainer();
    }
  }

  public static getInstance(): A11yService {
    if (!A11yService.instance) {
      A11yService.instance = new A11yService();
    }
    return A11yService.instance;
  }

  private initializeContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'a11y-notifications';
      this.container.setAttribute('aria-live', 'polite');
      this.container.className = 'sr-only';
      document.body.appendChild(this.container);
    }
  }

  /**
   * Benachrichtigt Screen Reader über wichtige Änderungen
   */
  public notify(
    message: string,
    options: A11yNotificationOptions = {}
  ): void {
    if (!this.container) {
      this.initializeContainer();
    }

    const {
      priority = 'polite',
      timeout = 5000,
      role = 'status'
    } = options;

    // Erstelle ein neues Element für die Benachrichtigung
    const notification = document.createElement('div');
    notification.setAttribute('role', role);
    notification.textContent = message;

    // Setze die ARIA-Live-Region-Politik
    this.container!.setAttribute('aria-live', priority);

    // Füge die Benachrichtigung hinzu
    this.container!.appendChild(notification);

    // Entferne die Benachrichtigung nach dem Timeout
    if (timeout > 0) {
      setTimeout(() => {
        if (notification.parentNode === this.container) {
          this.container!.removeChild(notification);
        }
      }, timeout);
    }
  }

  /**
   * Fokussiert ein Element barrierefrei
   */
  public focusElement(element: HTMLElement, announceToScreenReader = true): void {
    if (element) {
      // Stelle sicher, dass das Element fokussierbar ist
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '-1');
      }

      // Fokussiere das Element
      element.focus();

      // Optional: Kündige den Fokuswechsel an
      if (announceToScreenReader) {
        const elementRole = element.getAttribute('role') || element.tagName.toLowerCase();
        const elementLabel = element.getAttribute('aria-label') 
          || element.textContent 
          || `${elementRole} Element`;
        
        this.notify(`Fokus ist jetzt auf: ${elementLabel}`);
      }
    }
  }

  /**
   * Benachrichtigt über Fehler in einer barrierefreien Weise
   */
  public notifyError(error: Error, technical = false): void {
    const message = technical
      ? `Ein technischer Fehler ist aufgetreten: ${error.message}`
      : 'Ein Fehler ist aufgetreten. Die Seite wird neu geladen.';

    this.notify(message, {
      priority: 'assertive',
      role: 'alert',
      timeout: 7000
    });
  }

  /**
   * Fügt Keyboard-Navigation zu einem Element hinzu
   */
  public addKeyboardNavigation(
    element: HTMLElement,
    onEnter?: () => void,
    onEscape?: () => void
  ): void {
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && onEnter) {
        onEnter();
      } else if (event.key === 'Escape' && onEscape) {
        onEscape();
      }
    });
  }
}

export const a11yService = A11yService.getInstance();
