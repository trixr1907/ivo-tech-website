describe('ErrorBoundary E2E Tests', () => {
  beforeEach(() => {
    // Mock für Service Worker Registrierung
    cy.window().then((win) => {
      win.navigator.serviceWorker = {
        register: cy.stub().resolves({}),
        ready: Promise.resolve({
          showNotification: cy.stub().resolves({}),
        }),
      };
    });

    // Mock für Browser-Benachrichtigungen
    cy.window().then((win) => {
      win.Notification = {
        permission: 'granted',
        requestPermission: cy.stub().resolves('granted'),
      };
    });

    // Route zur Testseite
    cy.visit('/test/error-boundary');
  });

  it('zeigt Fehlermeldung und Benachrichtigung bei einem Fehler', () => {
    // Löse einen Fehler aus
    cy.get('[data-testid="trigger-error"]').click();

    // Prüfe ErrorBoundary UI
    cy.get('[role="alert"]').should('be.visible');
    cy.contains('Oops! Etwas ist schiefgelaufen').should('be.visible');
    cy.contains('Ein unerwarteter Fehler ist aufgetreten.').should('be.visible');

    // Prüfe Benachrichtigung
    cy.get('#notification-portal')
      .find('[role="alert"]')
      .should('be.visible')
      .and('contain', 'Fehler in der Anwendung');

    // Prüfe Benachrichtigungsaktionen
    cy.get('[data-testid="notification"]')
      .find('button')
      .should('have.length', 3); // Schließen, Neu laden, Details
  });

  it('zeigt Entwicklerdetails im Development-Modus', () => {
    // Setze Development-Modus
    cy.window().then((win) => {
      win.process = { env: { NODE_ENV: 'development' } };
    });

    // Löse einen Fehler aus
    cy.get('[data-testid="trigger-error"]').click();

    // Öffne Details
    cy.contains('Entwickler-Details anzeigen').click();

    // Prüfe Details-Inhalt
    cy.contains('Stackverlauf:').should('be.visible');
    cy.contains('Komponentenstapel:').should('be.visible');
  });

  it('ermöglicht Fehlerwiederherstellung', () => {
    // Löse einen Fehler aus
    cy.get('[data-testid="trigger-error"]').click();

    // Klicke auf "Erneut versuchen"
    cy.contains('Erneut versuchen').click();

    // Prüfe, dass die App wiederhergestellt wurde
    cy.get('[data-testid="app-content"]').should('be.visible');
    cy.get('[role="alert"]').should('not.exist');
  });

  it('handhabt mehrere Fehler korrekt', () => {
    // Löse mehrere Fehler aus
    for (let i = 0; i < 3; i++) {
      cy.get('[data-testid="trigger-error"]').click();
      cy.wait(1000); // Warte auf Animation
      cy.contains('Erneut versuchen').click();
    }

    // Prüfe Performance-Monitoring
    cy.window().then((win) => {
      expect(win.performanceMonitor.getMetricsSummary().errors).to.have.length(3);
    });
  });

  it('unterstützt Tastaturnavigation', () => {
    // Löse einen Fehler aus
    cy.get('[data-testid="trigger-error"]').click();

    // Prüfe Tastaturzugänglichkeit
    cy.get('body').tab();
    cy.focused().should('contain', 'Erneut versuchen');

    cy.get('body').tab();
    cy.focused().should('contain', 'Zur Startseite');

    // Prüfe Enter-Taste
    cy.focused().type('{enter}');
    cy.url().should('include', '/');
  });

  it('integriert sich mit dem Monitoring-Service', () => {
    const monitoringSpy = cy.spy().as('monitoringSpy');
    cy.window().then((win) => {
      win.monitoringService = {
        captureError: monitoringSpy,
        initialize: cy.stub(),
      };
    });

    // Löse einen Fehler aus
    cy.get('[data-testid="trigger-error"]').click();

    // Prüfe Monitoring-Aufruf
    cy.get('@monitoringSpy').should('have.been.calledOnce');
  });

  it('zeigt Benachrichtigungen korrekt an verschiedenen Positionen', () => {
    // Löse Fehler mit verschiedenen Benachrichtigungspositionen aus
    const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
    
    positions.forEach((position) => {
      cy.window().then((win) => {
        win.notificationService.show({
          type: 'error',
          title: `Test ${position}`,
          message: 'Testbenachrichtigung',
          position,
        });
      });
    });

    // Prüfe Benachrichtigungspositionen
    positions.forEach((position) => {
      cy.get(`[data-testid="notification-${position}"]`)
        .should('be.visible')
        .and('have.class', position);
    });
  });

  it('unterstützt verschiedene Benachrichtigungstypen', () => {
    const types = ['error', 'warning', 'info', 'success'];
    
    types.forEach((type) => {
      cy.window().then((win) => {
        win.notificationService.show({
          type,
          title: `Test ${type}`,
          message: 'Testbenachrichtigung',
        });
      });

      cy.get(`[data-testid="notification-${type}"]`)
        .should('be.visible')
        .and('have.class', `bg-${type}-500`);
    });
  });
});
