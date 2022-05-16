const prettier = require('prettier');

function formatCode(code, type) {
  return prettier.format(code, {
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 100,
    parser: ['less', 'scss', 'json', 'css', 'vue', 'html'].includes(type)
      ? type
      : 'babel',
  });
}

module.exports = formatCode;
