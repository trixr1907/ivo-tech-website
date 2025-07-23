/* eslint-disable no-restricted-globals */

// Cache-Name für die Service Worker Installation
const CACHE_NAME = 'error-notification-cache-v1';

// Assets, die gecacht werden sollen
const CACHE_URLS = [
  '/error-icon.png',
  '/favicon.ico'
];

// Service Worker Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
});

// Service Worker Aktivierung
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Benachrichtigungsklick-Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Öffne das Error-Dashboard wenn die Benachrichtigung angeklickt wird
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Prüfe, ob bereits ein Fenster geöffnet ist
      for (const client of clientList) {
        if (client.url.includes('/admin/error-metrics') && 'focus' in client) {
          return client.focus();
        }
      }
      // Wenn kein Fenster offen ist, öffne ein neues
      return clients.openWindow('/admin/error-metrics');
    })
  );
});

// Push-Benachrichtigungen Handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.message,
      icon: '/error-icon.png',
      badge: '/favicon.ico',
      tag: data.id || 'error-notification',
      requireInteraction: true,
      data: {
        url: data.url || '/admin/error-metrics'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Push-Benachrichtigung:', error);
  }
});

// Sync-Events für Offline-Unterstützung
self.addEventListener('sync', (event) => {
  if (event.tag === 'error-report') {
    event.waitUntil(
      // Implementiere hier die Offline-Synchronisation
      Promise.resolve()
    );
  }
});
