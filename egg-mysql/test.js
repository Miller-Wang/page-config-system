const MagicString = require('magic-string');
const { init, parse } = require('es-module-lexer');

const code = `
import React, { useState } from 'react';
import { Button } from "zarm";
import cn from "classnames";
import qs from 'qs';
import { deepClone } from 'lodash';
import * as umi from 'umi';
import List from '/components/MyList';


function List(props) {\n  const {\n    Button\n  } = zarm;\n  const [count, setCount] = useState(0);\n  return /*#__PURE__*/React.createElement(\"div\", {\n    className: \"list\"\n  }, /*#__PURE__*/React.createElement(\"h1\", null, \"Home\\uFF1A\", count), /*#__PURE__*/React.createElement(Button, {\n    theme: \"primary\",\n    onClick: () => setCount(count + 1)\n  }, \"Add\"));\n}

export default List;

`;

async function rewriteImports(bodyContent) {
  await init;
  const [imports, exports] = parse(bodyContent);
  const magicString = new MagicString(bodyContent);

  if (imports && imports.length > 0) {
    const libs = imports.map((v) => v.n);
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

      magicString.remove(ss, se);
    });

    const resStr = `const { ${result.join(', ')} } = props;`;

    magicString.prepend(resStr);
    console.log(magicString.toString());
  }
  return magicString.toString();
}

rewriteImports(code)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => console.log(err));

const { '/components/MyList': MyList } = {
  '/components/MyList': { abc: 123 },
};

console.log(MyList);
