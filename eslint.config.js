import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import js from '@eslint/js';

export default defineConfig([
  globalIgnores(['**/dist/**', '**/node_modules/**', '**/.moon/**', '**/coverage/**']),

  {
    name: 'base',
    files: ['**/*.js', '**/*.ts', '**/*.mjs', '**/*.cjs'],
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        Bun: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },

    plugins: {
      prettier,
    },

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',

      // JavaScript
      'no-console': 'warn',
      'no-debugger': 'error',

      // Prettier
      'prettier/prettier': 'error',
    },
  },

  {
    name: 'tests',
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'no-unused-expressions': 'off',
    },
  },
]);
