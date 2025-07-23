/** @type {import('jest').Config} */
const config = {
  displayName: 'performance',
  testMatch: ['<rootDir>/performance/**/*.perf.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  setupFiles: ['<rootDir>/performance/setup.ts'],
  testTimeout: 30000,
  maxWorkers: 1, // Führe Tests sequenziell aus für bessere Messung
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

module.exports = config;
