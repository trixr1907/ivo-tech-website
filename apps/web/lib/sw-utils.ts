/**
 * Service Worker Utilities für IVO-TECH PWA
 * Client-seitige Funktionen zur Kommunikation mit dem Service Worker
 */

export interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

export interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  installPrompt: any | null;
}

/**
 * Service Worker Registrierung und Management
 */
export class PWAManager {
  private state: ServiceWorkerState = {
    isSupported: false,
    isRegistered: false,
    isUpdateAvailable: false,
    registration: null,
  };

  private installState: PWAInstallState = {
    isInstallable: false,
    isInstalled: false,
    installPrompt: null,
  };

  private listeners: Set<(state: ServiceWorkerState) => void> = new Set();
  private installListeners: Set<(state: PWAInstallState) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeServiceWorker();
      this.initializeInstallPrompt();
    }
  }

  /**
   * Service Worker initialisieren
   */
  private async initializeServiceWorker() {
    // Service Worker Support prüfen
    if (!('serviceWorker' in navigator)) {
      console.warn('[PWA] Service Worker wird nicht unterstützt');
      return;
    }

    this.state.isSupported = true;
    this.notifyStateChange();

    try {
      // Service Worker registrieren
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      this.state.isRegistered = true;
      this.state.registration = registration;

      console.log('[PWA] Service Worker registriert:', registration.scope);

      // Update-Handler einrichten
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] Service Worker Update verfügbar');
              this.state.isUpdateAvailable = true;
              this.notifyStateChange();
            }
          });
        }
      });

      // Message Handler für SW-Kommunikation
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));

      this.notifyStateChange();
    } catch (error) {
      console.error('[PWA] Service Worker Registrierung fehlgeschlagen:', error);
    }
  }

  /**
   * PWA Installation Handler
   */
  private initializeInstallPrompt() {
    // beforeinstallprompt Event abfangen
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installState.installPrompt = event;
      this.installState.isInstallable = true;
      
      console.log('[PWA] Installation möglich');
      this.notifyInstallStateChange();
    });

    // appinstalled Event
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App wurde installiert');
      this.installState.isInstalled = true;
      this.installState.isInstallable = false;
      this.installState.installPrompt = null;
      this.notifyInstallStateChange();
    });

    // Prüfen ob bereits installiert (heuristische Erkennung)
    this.checkIfInstalled();
  }

  /**
   * Heuristische Prüfung ob PWA installiert ist
   */
  private checkIfInstalled() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
    
    // iOS Safari spezifische Erkennung
    const isIOSPWA = (window.navigator as any).standalone === true;
    
    if (isStandalone || isFullscreen || isMinimalUI || isIOSPWA) {
      this.installState.isInstalled = true;
      this.notifyInstallStateChange();
    }
  }

  /**
   * Service Worker Nachrichten verarbeiten
   */
  private handleServiceWorkerMessage(event: MessageEvent) {
    console.log('[PWA] Message vom Service Worker:', event.data);

    switch (event.data?.type) {
      case 'CACHE_UPDATED':
        console.log('[PWA] Cache wurde aktualisiert');
        break;
      case 'OFFLINE_READY':
        console.log('[PWA] App ist offline verfügbar');
        break;
      case 'UPDATE_AVAILABLE':
        this.state.isUpdateAvailable = true;
        this.notifyStateChange();
        break;
    }
  }

  /**
   * PWA Installation triggern
   */
  public async installPWA(): Promise<boolean> {
    if (!this.installState.installPrompt) {
      console.warn('[PWA] Kein Install Prompt verfügbar');
      return false;
    }

    try {
      const result = await this.installState.installPrompt.prompt();
      console.log('[PWA] Install Prompt Ergebnis:', result.outcome);

      if (result.outcome === 'accepted') {
        this.installState.installPrompt = null;
        this.installState.isInstallable = false;
        this.notifyInstallStateChange();
        return true;
      }
    } catch (error) {
      console.error('[PWA] Installation fehlgeschlagen:', error);
    }

    return false;
  }

  /**
   * Service Worker Update anwenden
   */
  public async updateServiceWorker(): Promise<void> {
    if (!this.state.registration) {
      console.warn('[PWA] Keine Service Worker Registrierung vorhanden');
      return;
    }

    const newWorker = this.state.registration.waiting;
    if (newWorker) {
      // Message senden um Skip Waiting zu triggern
      newWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Seite neu laden nach Aktivierung
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }

  /**
   * URLs für Offline-Verfügbarkeit vorläufig cachen
   */
  public async precacheUrls(urls: string[]): Promise<void> {
    if (!this.state.registration?.active) {
      console.warn('[PWA] Service Worker nicht aktiv');
      return;
    }

    this.state.registration.active.postMessage({
      type: 'CACHE_URLS',
      payload: urls,
    });
  }

  /**
   * State Change Listener registrieren
   */
  public onStateChange(callback: (state: ServiceWorkerState) => void): () => void {
    this.listeners.add(callback);
    // Initial state senden
    callback(this.state);
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Install State Change Listener registrieren
   */
  public onInstallStateChange(callback: (state: PWAInstallState) => void): () => void {
    this.installListeners.add(callback);
    // Initial state senden
    callback(this.installState);
    
    return () => {
      this.installListeners.delete(callback);
    };
  }

  /**
   * Aktuellen State abrufen
   */
  public getState(): ServiceWorkerState {
    return { ...this.state };
  }

  /**
   * Aktuellen Install State abrufen
   */
  public getInstallState(): PWAInstallState {
    return { ...this.installState };
  }

  /**
   * State Change Benachrichtigung
   */
  private notifyStateChange(): void {
    this.listeners.forEach(callback => callback(this.state));
  }

  /**
   * Install State Change Benachrichtigung
   */
  private notifyInstallStateChange(): void {
    this.installListeners.forEach(callback => callback(this.installState));
  }
}

// Singleton Instance
export const pwaManager = new PWAManager();

/**
 * React Hook für Service Worker State
 */
import React from 'react';

export function useServiceWorker() {
  const [state, setState] = React.useState<ServiceWorkerState>(pwaManager.getState());

  React.useEffect(() => {
    return pwaManager.onStateChange(setState);
  }, []);

  return {
    ...state,
    updateServiceWorker: pwaManager.updateServiceWorker.bind(pwaManager),
    precacheUrls: pwaManager.precacheUrls.bind(pwaManager),
  };
}

/**
 * React Hook für PWA Installation
 */
export function usePWAInstall() {
  const [state, setState] = React.useState<PWAInstallState>(pwaManager.getInstallState());

  React.useEffect(() => {
    return pwaManager.onInstallStateChange(setState);
  }, []);

  return {
    ...state,
    installPWA: pwaManager.installPWA.bind(pwaManager),
  };
}

/**
 * Utility Funktionen für PWA Features
 */
export const PWAUtils = {
  /**
   * Prüfen ob PWA Features unterstützt werden
   */
  isSupported: () => {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  },

  /**
   * Notification Permission anfordern
   */
  requestNotificationPermission: async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  },

  /**
   * Share API verwenden (falls verfügbar)
   */
  share: async (shareData: ShareData): Promise<boolean> => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.error('Share fehlgeschlagen:', error);
      }
    }
    return false;
  },

  /**
   * Clipboard API verwenden
   */
  copyToClipboard: async (text: string): Promise<boolean> => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error('Copy fehlgeschlagen:', error);
      }
    }
    return false;
  },
};
