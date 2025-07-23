interface ErrorDetails {
  error: Error;
  errorInfo?: {
    componentStack?: string;
  };
  location?: string;
  timestamp?: string;
}

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  public async trackError(details: ErrorDetails): Promise<void> {
    const { error, errorInfo, location } = details;
    
    // Erweiterte Fehlerinformationen sammeln
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      location: location || window.location.href,
      userAgent: window.navigator.userAgent,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    };

    // In Entwicklung: Console-Logging
    if (this.isDevelopment) {
      console.group('🔴 Fehler aufgetreten');
      console.error('Fehlermeldung:', error.message);
      console.error('Stack:', error.stack);
      if (errorInfo?.componentStack) {
        console.error('Komponenten-Stack:', errorInfo.componentStack);
      }
      console.error('Details:', errorDetails);
      console.groupEnd();
      return;
    }

    try {
      // In Produktion: An Backend-API senden
      const response = await fetch('/api/error-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error-Tracking fehlgeschlagen: ${errorData.error}`);
      }
    } catch (trackingError) {
      // Stille Fehlerbehandlung im Error-Tracker
      console.error('Fehler beim Error-Tracking:', trackingError);
    }
  }
}

export const errorTracker = ErrorTrackingService.getInstance();
