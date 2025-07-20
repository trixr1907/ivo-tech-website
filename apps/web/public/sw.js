// IVO-TECH Service Worker für Progressive Web App
// Workbox-ähnliche Caching-Strategien implementiert
const SW_VERSION = 'ivo-tech-v2.0.0';
const STATIC_CACHE = `ivo-tech-static-${SW_VERSION}`;
const DYNAMIC_CACHE = `ivo-tech-dynamic-${SW_VERSION}`;
const IMAGES_CACHE = `ivo-tech-images-${SW_VERSION}`;
const FONTS_CACHE = `ivo-tech-fonts-${SW_VERSION}`;
const API_CACHE = `ivo-tech-api-${SW_VERSION}`;

// Cache-Strategien Konfiguration
const CACHE_CONFIG = {
  static: {
    name: STATIC_CACHE,
    maxEntries: 60,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Tage
  },
  dynamic: {
    name: DYNAMIC_CACHE,
    maxEntries: 50,
    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Tage
  },
  images: {
    name: IMAGES_CACHE,
    maxEntries: 60,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Tage
  },
  fonts: {
    name: FONTS_CACHE,
    maxEntries: 30,
    maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Jahr
  },
  api: {
    name: API_CACHE,
    maxEntries: 50,
    maxAgeSeconds: 5 * 60, // 5 Minuten
  },
};

// Kritische Assets für sofortiges Caching
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-192x192.png',
  '/favicon.ico',
  // Wichtige CSS/JS werden von Next.js automatisch verwaltet
];

// URL-Pattern für verschiedene Strategien
const PATTERNS = {
  static: /\.(js|css|html|ico|svg)$/,
  images: /\.(jpg|jpeg|png|gif|webp|svg|avif)$/,
  fonts: /\.(woff|woff2|eot|ttf|otf)$/,
  api: /^\/api\//,
  navigation: /^\/(?!api|_next\/static)/,
};

// Assets die nicht gecacht werden sollen
const SKIP_CACHE_PATTERNS = [/\/api\//, /\/_next\/static\/development/, /chrome-extension/, /webpack-hmr/];

// Install Event - Cache statische Assets
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate Event - Cleanup alte Caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch Event - Caching Strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching für bestimmte URLs
  if (SKIP_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return;
  }

  // Nur GET requests cachen
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // Cache Hit - Network First für API calls, Cache First für Assets
      if (cachedResponse) {
        if (url.pathname.startsWith('/api/')) {
          // Network First für API
          return fetch(request)
            .then(networkResponse => {
              if (networkResponse.ok) {
                const responseClone = networkResponse.clone();
                caches.open(DYNAMIC_CACHE).then(cache => {
                  cache.put(request, responseClone);
                });
              }
              return networkResponse;
            })
            .catch(() => {
              return cachedResponse; // Fallback zu Cache bei Netzwerkfehler
            });
        } else {
          // Cache First für statische Assets
          return cachedResponse;
        }
      }

      // Cache Miss - Netzwerk Request mit Caching
      return fetch(request)
        .then(networkResponse => {
          // Nur erfolgreiche Responses cachen
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          const cacheToUse = url.pathname.startsWith('/api/') ? DYNAMIC_CACHE : STATIC_CACHE;

          caches.open(cacheToUse).then(cache => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Offline Fallback
          if (request.destination === 'document') {
            return caches.match('/');
          }

          // Für Images einen Placeholder zurückgeben
          if (request.destination === 'image') {
            return new Response(
              '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#1f2937"/><text x="50%" y="50%" text-anchor="middle" fill="#6b7280" dy=".3em">Offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }

          return new Response('Offline - Keine Verbindung verfügbar', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
    })
  );
});

// Background Sync für Offline-Aktionen
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered');

  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Hier können offline gespeicherte Aktionen synchronisiert werden
      console.log('[SW] Performing background sync')
    );
  }
});

// Push Notifications (optional für Zukunft)
self.addEventListener('push', event => {
  console.log('[SW] Push received');

  const options = {
    body: event.data ? event.data.text() : 'Neue Nachricht von IVO-TECH',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Website öffnen',
        icon: '/icons/icon-96x96.png',
      },
      {
        action: 'close',
        title: 'Schließen',
        icon: '/icons/icon-96x96.png',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification('IVO-TECH', options));
});

// Notification Click Handler
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click received');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  }
});

// Message Handler für Kommunikation mit Main Thread
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});
