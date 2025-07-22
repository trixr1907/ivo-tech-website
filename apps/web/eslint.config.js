import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser APIs
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        AudioContext: 'readonly',
        AnalyserNode: 'readonly',
        AudioNode: 'readonly',
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLImageElement: 'readonly',
        HTMLCanvasElement: 'readonly',
        IntersectionObserver: 'readonly',
        IntersectionObserverInit: 'readonly',
        PerformanceNavigationTiming: 'readonly',
        CustomEvent: 'readonly',
        EventListener: 'readonly',
        ErrorEvent: 'readonly',
        PromiseRejectionEvent: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        MediaQueryListEvent: 'readonly',
        NodeJS: 'readonly',
        CSS: 'readonly',
        THREE: 'readonly',
        React: 'readonly',
        alert: 'readonly',
      },
    },
    rules: {
      // TypeScript Regeln
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',

      // React Regeln
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',

      // React Hooks Regeln
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Allgemeine Regeln
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-undef': 'error',
      'no-empty-function': 'warn',
    },
  },
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
];
