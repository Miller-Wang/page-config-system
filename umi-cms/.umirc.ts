import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  antd: {
    dark: false,
  },
  layout: {
    // 支持任何不需要 dom 的
    // https://procomponents.ant.design/components/layout#prolayout
    name: 'Ant Design',
    locale: true,
    layout: 'side',
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7002/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  dynamicImport: {},
});
