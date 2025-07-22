/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next/core-web-vitals'],
  ignorePatterns: ['**/*'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off'
  }
};
