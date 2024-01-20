//@ts-check
/**
 * ESLint Configuration
 */
/** @type {import('eslint').ESLint.ConfigData} */
const config = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "unused-imports"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  env: { node: true, es2021: true },
  rules: {
    "no-param-reassign": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
    "@typescript-eslint/no-floating-promises": [
      "warn",
      {
        ignoreIIFE: true,
      },
    ],

    // Import Rules
    "no-unused-vars": "off", // Duplicate with unused-import/no-unused-vars
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "~/**",
            group: "parent",
            position: "before",
          },
        ],
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    "import/no-duplicates": ["error", { considerQueryString: true }],
  },
  ignorePatterns: ["*.js"],
};

module.exports = config;
