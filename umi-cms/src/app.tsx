import {
  BasicLayoutProps,
  Settings as LayoutSettings,
} from '@ant-design/pro-layout';
import { SmileOutlined } from '@ant-design/icons';
import './style.less';

const menu = [
  {
    path: '/',
    name: '项目列表',
    icon: <SmileOutlined />,
    routes: [
      {
        path: '/pageList',
        hideInMenu: true,
        name: '页面列表',
      },
      {
        path: '/pageEdit',
        hideInMenu: true,
        name: '页面详情',
      },
    ],
  },
  {
    path: '/componentList',
    name: '组件列表',
    icon: <SmileOutlined />,
    routes: [
      {
        path: '/componentEdit',
        hideInMenu: true,
        name: '组件编辑',
      },
    ],
  },
];

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: any };
}): BasicLayoutProps => {
  return {
    ...initialState?.settings,
    title: '页面配置系统',
    menuDataRender: () => menu,
  };
};
