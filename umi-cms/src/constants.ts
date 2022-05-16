/** 默认组件代码 */
export const DEFAULT_COMPONENT = `
import React from 'react';

// 组件
function Component(props) {
  return (
    <div>
    </div>
  );
}

// 测试组件
function Test(props) {
  return <Component />;
}

export default Component;
`;

/** 默认页面代码 */
export const DEFAULT_PAGE = `
import React from 'react';

// 页面组件
function Page(props) {
  return (
    <div>
    </div>
  );
}

export default Page;
`;
