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
        preset: 'mobile',
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false,
        },
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          requestLatencyMs: 150,
          downloadThroughputKbps: 1474.5600000000002,
          uploadThroughputKbps: 675,
          cpuSlowdownMultiplier: 4,
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
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Mobile-spezifische Metriken
        'viewport': 'error',
        'font-size': 'error',
        'tap-targets': 'error',
        'content-width': 'error',
        
        // Performance auf mobilen Geräten
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 500 }],
        
        // Mobile JavaScript-Performance
        'bootup-time': ['error', { maxNumericValue: 3000 }],
        'mainthread-work-breakdown': ['error', { maxNumericValue: 4000 }],
        'dom-size': ['error', { maxNumericValue: 1500 }],
        
        // Progressive Web App
        'service-worker': 'off',
        'installable-manifest': 'off',
        
        // Zugänglichkeit
        'color-contrast': 'error',
        'html-has-lang': 'error',
        'label': 'error',
        'link-name': 'error',
        
        // Mobile Best Practices
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
