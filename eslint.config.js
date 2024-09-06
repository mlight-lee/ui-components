import globals from 'globals'
import jsLint from '@eslint/js'
import tsLint from 'typescript-eslint'
import vueLint from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,jsx,tsx}"],
    languageOptions: {
      // common parser options, enable TypeScript and JSX
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module"
      }
    }
  },
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parser: "vue-eslint-parser",
      parserOptions: {
        // <script lang="ts" /> to enable TypeScript in Vue SFC
        parser: "@typescript-eslint/parser",
        sourceType: "module"
      }
    }
  },
  { 
    languageOptions: { 
      globals: { 
        ...globals.browser,
      } 
    }
  },
  {
    plugins: {
      // key "simple-import-sort" is the plugin namespace
      "simple-import-sort": pluginSimpleImportSort
    },
    rules: {
      "simple-import-sort/imports": [
        "error"
      ]
    }
  },
  jsLint.configs.recommended,
  ...tsLint.configs.recommended,
  ...vueLint.configs["flat/essential"],
  {
    ignores: ['node_modules', 'dist', 'public', '.nuxt']
  },
  eslintConfigPrettier,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": ["off"],
    }
  }
]