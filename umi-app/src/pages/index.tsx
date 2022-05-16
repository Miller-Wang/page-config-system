import React, { useEffect, useState, useCallback } from 'react';
import { Toast } from 'zarm';
import ComponentLoader, { loadComponents } from '@/components/ComponentLoader';
import * as Request from '../request';
import 'zarm/dist/zarm.min.css';

// @ts-ignore
window.$app = {};

export default function View(props: any) {
  const { params } = props.match;
  const [isComponent, setIsComponent] = useState(
    window.location.pathname.startsWith('/components/'),
  );
  const [component, setComponent] = useState<any>({
    code: '', // 加载的组件代码
    components: [], // 依赖的组件
  });

  const refresh = useCallback(() => {
    Request.getPageDetail(params.project).then((data) => {
      if (!data.success) return Toast.show(data.msg);
      window.document.title = data.data.name;
      setComponent(data.data);
    });
  }, []);

  const getComponents = useCallback(async () => {
    const { data, success } = await Request.getComponents();
    if (!success) return Toast.show(data.msg);
    loadComponents(data.pages);
    // 等组件都加载完成，再加载页面代码
    refresh();
  }, []);

  useEffect(() => {
    getComponents();
    // fix: 同一组件不刷新问题
    let curPathname = window.location.pathname;
    props.history.listen((route: { pathname: string }, type: any) => {
      if (route.pathname !== curPathname) {
        refresh();
        curPathname = route.pathname;
        setIsComponent(curPathname.startsWith('/components/'));
      }
      if (window.parent) {
        window.parent.postMessage(
          { type: 'changeUrl', payload: route.pathname },
          '*',
        );
      }
    });
    // 处理iframe前进后退
    window.addEventListener('message', function (event) {
      const { data } = event;
      switch (data.type) {
        case 'go':
          window.history.forward();
          break;
        case 'back':
          window.history.back();
          break;
        case 'refresh':
          window.location.reload();
          break;
      }
    });
  }, []);

  return (
    <ComponentLoader {...props} {...component} isComponent={isComponent} />
  );
}
