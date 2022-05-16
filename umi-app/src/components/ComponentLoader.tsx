import * as react from 'react';
import * as zarm from 'zarm';
import * as umi from 'umi';

function loadStyle(styleCode: string) {
  const style = window.document.createElement('style');
  style.innerText = styleCode;
  document.head.appendChild(style);
}

export function loadComponents(pages: any[]) {
  const modules = { react, zarm, umi, ...window.$app };
  pages.forEach((page: any) => {
    new Function('modules', page.code)(modules);
    loadStyle(page.style);
  });
}

function loadComponent(props: any) {
  const { code, style, components = [], libs = [] } = props;
  const path = window.location.pathname;
  const modules = { react, zarm, umi, ...window.$app };
  try {
    new Function('modules', code)(modules);
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
