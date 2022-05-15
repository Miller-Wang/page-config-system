import React from 'react';
import * as zarm from 'zarm';
import * as umi from 'umi';

function loadStyle(styleCode: string) {
  const style = window.document.createElement('style');
  style.innerText = styleCode;
  document.head.appendChild(style);
}

function loadComponent(props: any) {
  const { code, style, components = [], libs = [] } = props;
  const path = window.location.pathname;

  const deps = Array.from(new Set(['React', ...libs, ...components]));

  // 结构依赖
  const fnBody = `
    var { ${deps.join(',')} } = libs; 
    var { ${Object.keys(React)
      .filter((k) => k.startsWith('use'))
      .join(',')} } = React; 
    ${code}`;
  try {
    new Function('libs', fnBody)({ React, zarm, umi });
    const Com = window.$app[path];
    loadStyle(style);

    // 是页面，直接返回
    if (!window.location.pathname.startsWith('/components')) {
      return Com;
    }
    return window.$app[`${path}/test`];
  } catch (error) {
    console.error(error);
  }
}

// 根据字符串加载组件
function ComponentLoader(props: any) {
  const { code, isComponent } = props;
  if (!code) return <div>Loading...</div>;

  const path = window.location.pathname;

  let Com = isComponent ? window.$app[`${path}/test`] : window.$app[path];
  if (!Com) {
    Com = loadComponent(props);
  }

  if (!Com) return null;

  return <Com {...props} />;
}

export default ComponentLoader;
