'use client';

import { usePWA } from '../hooks/usePWA';

export function PWAProvider() {
  const { isInstallable, isInstalled, installApp, updateInfo, applyUpdate } =
    usePWA();

  return (
    <>
      {/* PWA Installation Hinweis */}
      {isInstallable && !isInstalled && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg transition-colors hover:bg-blue-700">
          <button
            onClick={installApp}
            className="text-sm font-semibold"
            aria-label="App installieren"
          >
            📱 App installieren
          </button>
          <p className="mt-1 text-xs opacity-90">Für bessere Performance</p>
        </div>
      )}

      {/* PWA Update Hinweis */}
      {updateInfo.isUpdateAvailable && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg transition-colors hover:bg-green-700">
          <button
            onClick={applyUpdate}
            className="text-sm font-semibold"
            aria-label="Update anwenden"
          >
            🔄 Update verfügbar
          </button>
          <p className="mt-1 text-xs opacity-90">Klicken für neue Features</p>
        </div>
      )}

      {/* PWA Status im Development Mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed left-4 top-4 z-50 rounded bg-black/80 px-2 py-1 font-mono text-xs text-white">
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${isInstalled ? 'bg-green-400' : 'bg-yellow-400'}`}
            />
            <span>PWA: {isInstalled ? 'Installed' : 'Web'}</span>
          </div>
          {isInstallable && !isInstalled && (
            <div className="mt-1 text-yellow-300">Install verfügbar</div>
          )}
          {updateInfo.isUpdateAvailable && (
            <div className="mt-1 text-green-300">Update bereit</div>
          )}
        </div>
      )}
    </>
  );
}

export default PWAProvider;
