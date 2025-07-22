// Vereinfachte ESLint-Konfiguration für Next.js 15
export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      '**/*.worklet.js',
      '**/jest.setup.js',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Deaktiviere problematische Regeln
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': 'off',
      'no-console': 'off',
    },
  },
];
