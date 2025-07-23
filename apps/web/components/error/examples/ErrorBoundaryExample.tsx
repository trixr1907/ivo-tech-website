import React, { useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';

// Komponente, die einen Fehler auslöst
const BuggyCounter: React.FC = () => {
  const [counter, setCounter] = useState(0);

  if (counter === 5) {
    throw new Error('Ich bin ein simulierter Fehler bei Zählerstand 5!');
  }

  return (
    <div className="p-4 border rounded">
      <p className="mb-4">
        Zählerstand: {counter}
      </p>
      <button
        onClick={() => setCounter(c => c + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Erhöhen
      </button>
      <p className="mt-4 text-sm text-gray-600">
        Bei Zählerstand 5 wird ein Fehler ausgelöst
      </p>
    </div>
  );
};

// Benutzerdefinierte Fehlerkomponente
const CustomErrorFallback: React.FC<{
  error: Error;
  resetError: () => void;
}> = ({ error, resetError }) => (
  <div className="p-4 border border-yellow-500 rounded bg-yellow-50">
    <h3 className="text-lg font-bold text-yellow-800">
      Ups! Ein benutzerdefinierter Fehler
    </h3>
    <p className="mt-2 text-yellow-700">
      Fehlermeldung: {error.message}
    </p>
    <button
      onClick={resetError}
      className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
    >
      Zurücksetzen
    </button>
  </div>
);

// Beispielkomponente mit verschiedenen ErrorBoundary-Anwendungen
export const ErrorBoundaryExample: React.FC = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">
        ErrorBoundary Beispiele
      </h1>

      {/* Beispiel 1: Standard ErrorBoundary */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          1. Standard ErrorBoundary
        </h2>
        <ErrorBoundary>
          <BuggyCounter />
        </ErrorBoundary>
      </section>

      {/* Beispiel 2: Benutzerdefinierte Fehlerkomponente */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          2. Mit benutzerdefinierter Fehlerkomponente
        </h2>
        <ErrorBoundary fallback={CustomErrorFallback}>
          <BuggyCounter />
        </ErrorBoundary>
      </section>

      {/* Beispiel 3: Verschachtelte ErrorBoundaries */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          3. Verschachtelte ErrorBoundaries
        </h2>
        <ErrorBoundary>
          <div className="grid grid-cols-2 gap-4">
            <ErrorBoundary>
              <BuggyCounter />
            </ErrorBoundary>
            <ErrorBoundary>
              <BuggyCounter />
            </ErrorBoundary>
          </div>
        </ErrorBoundary>
      </section>
    </div>
  );
};

export default ErrorBoundaryExample;
