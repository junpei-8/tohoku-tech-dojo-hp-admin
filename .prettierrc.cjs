module.exports = {
  printWidth: 80,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  htmlWhitespaceSensitivity: 'ignore',

  /** @see https://www.npmjs.com/package/prettier-plugin-jsdoc#options */
  plugins: [require('prettier-plugin-jsdoc')],
  jsdocVerticalAlignment: true,
  jsdocCapitalizeDescription: false,
  jsdocPreferCodeFences: true,
  jsdocKeepUnParseAbleExampleIndent: true,
};
