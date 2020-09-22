module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'standard',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    "no-await-in-loop": "off",
    "import/prefer-default-export": "off",
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "typescript-eslint/no-var-requires": "off"
      }
    }
  ],
  settings: {
    "import/extensions": ["*.ts", "*.js"],
    "import/parsers": {
      "typescript-eslint/parser": ["*.ts", "*.js"]
    },
  },
}
