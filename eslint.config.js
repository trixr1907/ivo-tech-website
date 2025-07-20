import { config as baseConfig } from '@config/eslint/base';

/** @type {import("eslint").Linter.Config} */
export default [
  ...baseConfig,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'out/**',
      '.next/**',
      '.turbo/**',
      'coverage/**',
      'backups/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      '**/*.worklet.js',
      '**/jest.setup.js',
    ],
  },
];
