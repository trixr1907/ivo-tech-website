module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/test/error-boundary'
      ],
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        skipAudits: [
          'uses-http2',
          'uses-long-cache-ttl',
          'canonical',
          'tap-targets',
        ],
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Spezifische Metriken für ErrorBoundary
        'first-contentful-paint': ['error', { maxNumericValue: 1000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // JavaScript-Performance
        'bootup-time': ['error', { maxNumericValue: 2000 }],
        'mainthread-work-breakdown': ['error', { maxNumericValue: 3000 }],
        'dom-size': ['error', { maxNumericValue: 1500 }],
        
        // Progressive Web App
        'service-worker': 'off',
        'installable-manifest': 'off',
        
        // Zugänglichkeit
        'color-contrast': 'error',
        'html-has-lang': 'error',
        'label': 'error',
        'link-name': 'error',
        
        // Best Practices
        'no-document-write': 'error',
        'errors-in-console': 'error',
        'js-libraries': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
      githubToken: process.env.GITHUB_TOKEN,
      githubAppToken: process.env.GITHUB_APP_TOKEN,
    },
    server: {
      port: 9001,
      storage: {
        sqlDatabasePath: './.lighthouse/db.sql',
      },
    },
  },
};
