'use client';

import { useState } from 'react';

const ErrorComponent = () => {
  throw new Error('Test-Fehler für E2E-Tests');
  return null;
};

export const ErrorTrigger = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    return <ErrorComponent />;
  }

  return (
    <div data-testid="app-content" className="p-8">
      <h1 className="text-2xl font-bold mb-4">ErrorBoundary Test</h1>
      <button
        data-testid="trigger-error"
        onClick={() => setShouldError(true)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Fehler auslösen
      </button>
    </div>
  );
};
