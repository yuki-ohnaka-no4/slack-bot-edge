//@ts-check
/**
 * Prettier Configuration
 * @type {import('prettier').Config}
 */
const config = {
  // 設定
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  rangeStart: 0,
  rangeEnd: Infinity,
  requirePragma: false,
  insertPragma: false,
  proseWrap: "preserve",
  htmlWhitespaceSensitivity: "css",
  vueIndentScriptAndStyle: false,
  endOfLine: "lf",
  embeddedLanguageFormatting: "auto",
  singleAttributePerLine: false,
  overrides: [
    // Revert JSONC parsing:
    // https://github.com/prettier/prettier/issues/15553
    {
      files: ["**/*.json", "**/*.jsonc"],
      options: {
        parser: "json",
      },
    },
  ],
};

module.exports = config;
