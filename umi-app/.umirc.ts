import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },

  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/:project', component: '@/pages/index' },
    { path: '/:project/:one', component: '@/pages/index' },
    { path: '/:project/:one/:two', component: '@/pages/index' },
    { path: '/:project/:one/:two/:three', component: '@/pages/index' },
  ],
  fastRefresh: {},
  // hd: {},
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7002/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
