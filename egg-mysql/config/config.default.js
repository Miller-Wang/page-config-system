'use strict';

module.exports = appInfo => {
  const config = (exports = {});
  config.keys = appInfo.name + '_1590300831086_1023';
  config.middleware = [];

  config.mysql = {
    client: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '12345678',
      database: 'page_config',
    },
    app: true, // 给app添加属性  app.mysql
    agent: true,
  };

  // add your user config here
  const userConfig = {
    myAppName: 'egg',
  };

  // csrf安全配置， 白名单配置
  config.security = {
    csrf: false,
    domainWhiteList: ['http://localhost:3000'],
  };

  config.cors = {
    credentials: true,
  };

  return {
    ...config,
    ...userConfig,
  };
};
