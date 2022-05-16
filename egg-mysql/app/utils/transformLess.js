const less = require('less');

async function transformLess(lessCode) {
  if (!lessCode) return '';
  const { css } = await less.render(lessCode);
  return css;
}

module.exports = transformLess;
