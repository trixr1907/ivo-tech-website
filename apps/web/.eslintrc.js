/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next/core-web-vitals'],
  ignorePatterns: ['**/*'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'ignoreRestSiblings': true
    }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-function': ['error', {
      'allow': ['arrowFunctions']
    }],
    'react-hooks/exhaustive-deps': 'warn',
    'no-empty-function': 'off',
    '@typescript-eslint/no-namespace': ['error', {
      'allowDeclarations': true
    }]
  },
  overrides: [
    {
      files: ['**/*.d.ts'],
      rules: {
        'no-var': 'off',
        'no-undef': 'off'
      }
    },
    {
      files: ['**/worklets/*.js'],
      env: {
        browser: true
      },
      globals: {
        'registerPaint': 'readonly',
        'PaintSize': 'readonly',
        'PaintRenderingContext2D': 'readonly',
        'StylePropertyMapReadonly': 'readonly'
      }
    }
  ]
};
