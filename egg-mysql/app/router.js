'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;

  // 项目接口
  router.get('/projects', controller.project.getAllProjects);

  router.get('/project/:id', controller.project.getProjectInfo);

  router.post('/addProject', controller.project.addProject);

  router.post('/updateProject/:id', controller.project.updateProject);

  router.delete('/project/:id', controller.project.delProject);

  // 页面接口
  router.get('/:id/pages', controller.pages.getPages);

  // 页面详情
  router.get('/page/:id', controller.pages.pageDetail);

  router.post('/:projectId/addPage', controller.pages.addPage);

  router.post('/:projectId/updatePage/:id', controller.pages.updatePage);

  router.delete('/page/:id', controller.pages.delPage);

  // h5接口 根据页面路径与项目id获取页面详情
  router.get('/:code/page', controller.pages.getDetailByPath);

  // 代码格式化
  router.post('/page/codeFormat', controller.pages.codeFormat);

  // 校验代码
};
