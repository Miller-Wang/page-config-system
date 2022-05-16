import * as react from 'react';
import * as zarm from 'zarm';
import * as umi from 'umi';

function loadStyle(styleCode: string) {
  const style = window.document.createElement('style');
  style.innerText = styleCode;
  document.head.appendChild(style);
}

export function loadComponent(componentModules: any, page: any, isPage?: boolean) {
  const { code, style } = page;
  const dependencies = (page.dependencies || '').split(',').filter((v: string) => !!v);

  if (!isPage) {
    const path = `/components${page.path}`;
    // 模块加载过了
    if (window.$app[path]) return window.$app[path];
  }
  
  // 未加载的依赖
  const unloadDependencies = dependencies.filter((dep: string) => !window.$app[dep]);

  if (unloadDependencies.length > 0) {
    // 先加载依赖
    unloadDependencies.forEach((dep: string) => loadComponent(componentModules, componentModules[dep]));
  }

  const modules = { react, zarm, umi, ...window.$app };
  new Function('modules', code)(modules);
  loadStyle(style);
}

function getComponent(props: any) {
  const { pageConfig, componentModules } = props;
  const path = window.location.pathname;
  try {
    loadComponent(componentModules, pageConfig, true);

    const Com = window.$app[path];

    // 是组件，加载组件的测试组件
    if (window.location.pathname.startsWith('/components')) {
      return window.$app[`${path}/test`];
    }
    return Com;
  } catch (error) {
    console.error(error);
  }
}

// 根据字符串加载组件
function ComponentLoader(props: any) {
  const { pageConfig: { code }, isComponent } = props;
  if (!code) return <div>Loading...</div>;

  const path = window.location.pathname;

  let Com = isComponent ? window.$app[`${path}/test`] : window.$app[path];
  if (!Com) {
    Com = getComponent(props);
  }

  if (!Com) return null;

  return <Com {...props} />;
}

export default ComponentLoader;
