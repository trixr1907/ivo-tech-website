module.exports = {
  ci: {
    collect: {
      // Anzahl der Durchläufe für jede URL
      numberOfRuns: 3,
      // Maximale Zeit für das Laden der Seite
      maxWaitForLoad: 30000,
      // Chrome Flags für bessere Konsistenz
      chromeFlags: '--no-sandbox --headless',
    },
    assert: {
      // Performance Budgets
      assertions: {
        'categories:performance': ['error', {minScore: 0.8}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}],
        // Spezifische Metriken
        'first-contentful-paint': ['error', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'interactive': ['error', {maxNumericValue: 3500}],
        'speed-index': ['error', {maxNumericValue: 3000}],
        'total-blocking-time': ['error', {maxNumericValue: 300}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
      },
    },
    upload: {
      // Upload der Ergebnisse zu temporärem Speicher
      target: 'temporary-public-storage',
    },
  },
};
