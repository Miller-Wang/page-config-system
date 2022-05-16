const prettier = require('prettier');

function formatCode(code) {
  return prettier.format(code, {
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 100,
  });
}

module.exports = formatCode;
