const bable = require('@babel/core');
const MagicString = require('magic-string');
const { init, parse } = require('es-module-lexer');

const exportReg = /export default (.*);?/;

/**
 * 重写import方法
 * import React, { useState } from 'react';
 * import { Button } from "zarm";
 * import cn from "classnames";
 * import qs from 'qs';
 * import { deepClone } from 'lodash';
 * import * as umi from 'umi';
 * 重写为
 * const { react: { useState }, react: React, zarm: { Button }, classnames: cn, qs, lodash: { deepClone }, umi } = libs;
 */
async function rewriteImports(bodyContent) {
  await init;
  const [imports, exports] = parse(bodyContent);
  const magicString = new MagicString(bodyContent);

  // 内部依赖
  const dependencies = [];

  if (imports && imports.length > 0) {
    // const libs = imports.map((v) => v.n);
    const result = [];

    imports.forEach(({ n, s, e, ss, se }) => {
      const statement = bodyContent.substring(ss, se);
      if (statement.includes('{')) {
        const [, matched] = statement.match(/\{(.*)\}/);
        matched && result.push(`${n}: {${matched}}`);
        if (/import ([^\{.]*),/.test(statement)) {
          const [, matchedLib] = statement.match(/import ([^\{.]*),/);
          matchedLib && result.push(`'${n}': ${matchedLib}`);
        }
      } else {
        let [, matched] = statement.match(/import (.*) from/);
        if (matched.includes('* ') && matched.includes('as ')) {
          matched = matched.replace(/\s/g, '').replace('*as', '');
        }

        matched && result.push(n === matched ? n : `'${n}': ${matched}`);
      }

      // 是内部依赖
      if (n.startsWith('/')) {
        dependencies.push(n);
      }

      magicString.remove(ss, se);
    });

    const resStr = `const { ${result.join(', ')} } = modules;`;
    magicString.prepend(resStr);
  }
  return {
    code: magicString.toString(),
    dependencies,
  };
}

/**
 * 编译代码
 * @param {*} page
 * @returns
 */
async function transformCode(page) {
  const { sourcecode, pathname } = page;
  const [_, componentName] = sourcecode.match(exportReg);

  let result = await bable.transformAsync(sourcecode.replace(exportReg, ''), {
    presets: ['@babel/preset-react'],
  });

  const { code, dependencies } = await rewriteImports(result.code);

  result.code = `${code}\nwindow.$app['${pathname}'] = ${componentName}`;

  // 如果是组件要导出测试组件
  if (pathname.startsWith('/components/')) {
    result.code += `\nwindow.$app['${pathname}/test'] = Test;`;
  }

  page.dependencies = dependencies.join(',');
  delete page.pathname;
  return result.code;
}

module.exports = transformCode;
