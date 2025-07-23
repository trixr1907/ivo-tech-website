'use client';

import React from 'react';

interface AppErrorProps {
  error: Error;
  reset: () => void;
}

const AppError = ({ error, reset }: AppErrorProps): JSX.Element => {
  if (typeof window !== 'undefined') {
    console.error('App Error:', error);
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-red-500">
          Ups, etwas ist schiefgelaufen!
        </h1>
        <p className="mb-8 text-xl text-gray-400">
          Ein unerwarteter Fehler ist aufgetreten. Wir arbeiten daran.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-600 hover:to-purple-700"
        >
          Seite neu laden
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 max-w-2xl rounded-lg bg-red-900/20 p-4">
          <p className="font-mono text-sm text-red-400">{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default AppError;
