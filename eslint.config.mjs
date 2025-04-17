// @ts-check
import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort
    }
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true
        }
      ],
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Node.js builtins come first
            ['^node:'],
            // NestJS and other npm packages
            ['^@nestjs', '^@?\\w'],
            // Internal modules and aliases
            ['^(@|src)(/.*|$)'],
            // Side effect imports
            ['^\\u0000'],
            // NestJS application modules
            [
              '^@(modules|controllers|services|entities|repositories|pipes|guards|interceptors|filters|decorators|dto|interfaces)(/.*|$)'
            ],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+\\.?(css)$']
          ]
        }
      ],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ]
    }
  }
)
