'use client';

import { useEffect, useState } from 'react';

interface PWAUpdateAvailable {
  waiting: ServiceWorker | null;
  isUpdateAvailable: boolean;
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [updateInfo, setUpdateInfo] = useState<PWAUpdateAvailable>({
    waiting: null,
    isUpdateAvailable: false,
  });
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Service Worker registrieren
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            '/sw.js',
            {
              scope: '/',
            }
          );

          console.log('[PWA] Service Worker registriert:', registration);

          // Update Detection
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Update verfügbar
                  setUpdateInfo({
                    waiting: newWorker,
                    isUpdateAvailable: true,
                  });

                  // User über Update informieren
                  console.log('[PWA] Update verfügbar - bitte Seite neu laden');
                } else {
                  // App ist gecacht für Offline-Nutzung
                  console.log('[PWA] App bereit für Offline-Nutzung');
                }
              }
            });
          });

          // SW bereits aktiv prüfen
          if (registration.waiting) {
            setUpdateInfo({
              waiting: registration.waiting,
              isUpdateAvailable: true,
            });
          }
        } catch (error) {
          console.error(
            '[PWA] Service Worker Registrierung fehlgeschlagen:',
            error
          );
        }
      }
    };

    registerServiceWorker();

    // PWA Install Prompt Handler
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[PWA] Install prompt triggered');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // App Install Handler
    const handleAppInstalled = () => {
      console.log('[PWA] App wurde installiert');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Display Mode Change Handler
    const handleDisplayModeChange = () => {
      const isStandalone = window.matchMedia(
        '(display-mode: standalone)'
      ).matches;
      const isFullscreen = window.matchMedia(
        '(display-mode: fullscreen)'
      ).matches;
      setIsInstalled(isStandalone || isFullscreen);
    };

    // Event Listeners hinzufügen
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Display Mode bei Load prüfen
    handleDisplayModeChange();
    window
      .matchMedia('(display-mode: standalone)')
      .addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // App Installation triggern
  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log('[PWA] Install prompt result:', outcome);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[PWA] Installation error:', error);
      return false;
    }
  };

  // Update anwenden
  const applyUpdate = () => {
    if (!updateInfo.waiting) return;

    updateInfo.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Warte auf Update und reloade
    const handleUpdateReady = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      handleUpdateReady,
      {
        once: true,
      }
    );
  };

  // Cache preloaden für bessere Performance
  const preloadResources = (urls: string[]) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_URLS',
        payload: urls,
      });
    }
  };

  // Share API verwenden (falls verfügbar)
  const shareContent = async (shareData: {
    title?: string;
    text?: string;
    url?: string;
  }) => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.log('[PWA] Share abgebrochen:', error);
        return false;
      }
    }

    // Fallback zu Clipboard API
    if (navigator.clipboard && shareData.url) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        return true;
      } catch (error) {
        console.error('[PWA] Clipboard write failed:', error);
        return false;
      }
    }

    return false;
  };

  return {
    isInstallable,
    isInstalled,
    updateInfo,
    installApp,
    applyUpdate,
    preloadResources,
    shareContent,
  };
}
