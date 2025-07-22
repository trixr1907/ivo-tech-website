'use client';

import { PWAProvider } from '../../components/PWAProvider';

export default function TestPWA() {
  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold">PWA Test Page</h1>
      <p className="mb-4 text-xl">Diese Seite testet die PWA-Funktionalität.</p>

      <div className="space-y-4">
        <div className="rounded-lg bg-blue-900/30 p-4">
          <h2 className="mb-2 text-2xl font-semibold">Features:</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Service Worker Status</li>
            <li>Cache-Strategien</li>
            <li>Offline Support</li>
            <li>Push-Notifications</li>
          </ul>
        </div>
      </div>

      <PWAProvider />
    </div>
  );
}
