const ctx: Worker = self as any;

interface PrefetchMessage {
  type: 'INIT';
  bundles: string[];
}

// Queue für Prefetch-Operationen
let prefetchQueue: string[] = [];
let isProcessing = false;

// Empfange Nachrichten vom Hauptthread
ctx.addEventListener('message', (event: MessageEvent<PrefetchMessage>) => {
  const { type, bundles } = event.data;

  if (type === 'INIT') {
    prefetchQueue = bundles;
    processPrefetchQueue();
  }
});

// Verarbeite die Prefetch-Queue
async function processPrefetchQueue() {
  if (isProcessing || prefetchQueue.length === 0) return;

  isProcessing = true;

  try {
    // Verarbeite maximal 2 Chunks gleichzeitig
    while (prefetchQueue.length > 0) {
      const currentBatch = prefetchQueue.splice(0, 2);
      
      await Promise.all(
        currentBatch.map(async (path) => {
          try {
            // Prefetch chunk
            const response = await fetch(
              `/_next/static/chunks/pages${path}.js`,
              { priority: 'low' }
            );

            if (!response.ok) {
              throw new Error(`Failed to prefetch: ${path}`);
            }

            // Cache response
            const cache = await caches.open('next-chunks');
            await cache.put(
              `/_next/static/chunks/pages${path}.js`,
              response
            );

            // Informiere den Hauptthread
            ctx.postMessage({
              type: 'CHUNK_PREFETCHED',
              path,
              success: true
            });

          } catch (error) {
            console.error(`Prefetch error for ${path}:`, error);
            ctx.postMessage({
              type: 'CHUNK_PREFETCHED',
              path,
              success: false,
              error: error.message
            });
          }
        })
      );

      // Kurze Pause zwischen Batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } finally {
    isProcessing = false;
  }
}

// Netzwerk-Status überwachen
if ('connection' in navigator) {
  (navigator as any).connection.addEventListener('change', () => {
    const connection = (navigator as any).connection;
    
    // Passe Prefetching basierend auf Netzwerkqualität an
    if (connection.saveData || connection.effectiveType === 'slow-2g') {
      // Stoppe Prefetching bei schlechter Verbindung
      prefetchQueue = [];
    } else if (!isProcessing && prefetchQueue.length > 0) {
      // Starte Prefetching bei guter Verbindung
      processPrefetchQueue();
    }
  });
}

// Speicher-Management
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

async function manageCache() {
  try {
    const cache = await caches.open('next-chunks');
    const entries = await cache.keys();
    
    if (entries.length > 50) { // Max 50 Chunks
      const oldestEntry = entries[0];
      await cache.delete(oldestEntry);
    }

    // Prüfe Cache-Größe
    let totalSize = 0;
    for (const entry of entries) {
      const response = await cache.match(entry);
      if (response) {
        totalSize += (await response.blob()).size;
      }
    }

    // Lösche älteste Einträge wenn Cache zu groß
    if (totalSize > MAX_CACHE_SIZE) {
      await cache.delete(entries[0]);
    }
  } catch (error) {
    console.error('Cache management error:', error);
  }
}

// Regelmäßige Cache-Verwaltung
setInterval(manageCache, 5 * 60 * 1000); // Alle 5 Minuten
