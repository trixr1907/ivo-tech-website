import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    experimentalStudio: true,
    experimentalWebKitSupport: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // Cypress-Plugins hier konfigurieren
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  env: {
    coverage: false,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
