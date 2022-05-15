const bable = require('@babel/core');

const exportReg = /export default (.*);?/;

/**
 * 编译代码
 * @param {*} page
 * @param {*} isComponent 是否是组件
 * @returns
 */
async function transformCode(page) {
  const { sourcecode, path, isComponent } = page;

  const [_, componentName] = sourcecode.match(exportReg);

  const result = await bable.transformAsync(sourcecode.replace(exportReg, ''), {
    presets: ['@babel/preset-react'],
  });

  result.code += `window.$app['${path}'] = ${componentName}`;

  // 如果是组件要导出测试组件
  if (isComponent) {
    result.code += `window.$app['${path}/test'] = Test;`;
  }

  delete page.isComponent;
  return result.code;
}

module.exports = transformCode;
