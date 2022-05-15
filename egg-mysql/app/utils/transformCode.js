const bable = require('@babel/core');

const exportReg = /export default (.*);?/;

/**
 * 编译代码
 * @param {*} page
 * @param {*} isComponent 是否是组件
 * @returns
 */
async function transformCode(page) {
  const { sourcecode, pathname } = page;
  const [_, componentName] = sourcecode.match(exportReg);

  const result = await bable.transformAsync(sourcecode.replace(exportReg, ''), {
    presets: ['@babel/preset-react'],
  });

  result.code += `window.$app['${pathname}'] = ${componentName}`;

  // 如果是组件要导出测试组件
  if (pathname.startsWith('/components/')) {
    result.code += `window.$app['${pathname}/test'] = Test;`;
  }

  delete page.pathname;
  return result.code;
}

module.exports = transformCode;
