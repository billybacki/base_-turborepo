const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      // Allows for the parsing of JSX
      jsx: true
    }
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    require.resolve('@vercel/style-guide/eslint/next'),
    'turbo'
  ],
  globals: {
    React: true,
    JSX: true
  },
  env: {
    node: true,
    browser: true
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        project
      }
    }
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    'node_modules/'
  ],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }],
  plugins: ['prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'prettier/prettier': [
      'error',
      {
        usePrettierrc: true
      }
    ],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
}
