# 页面配置系统

- 技术栈 egg-mysql、umi
  > 一套简单的页面配置系统，在管理后台创建项目，项目下创建页面，页面中可以添加组件代码，支持实时预览，前端组件代码全部保存在数据库，通过接口请求加载组件代码，灵活配置页面与组件

![项目列表](./images/projects.png)
![页面列表](./images/pages.png)
![编辑页面](./images/editor.png)

## egg-mysql

> 提供后台与应用的接口服务

- 项目增删改查
- 页面增删改查
- 支持代码中 import 外部依赖解析
- 支持代码中引入内部组件的解析
- 支持 jsx 和 less 代码格式化
- 支持 model 代码解析

### 建表语句

```sql
CREATE TABLE `project` (
  `name` varchar(255) DEFAULT NULL COMMENT '项目名',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '项目id',
  `desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `code` varchar(255) NOT NULL COMMENT '项目code',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;


CREATE TABLE `pages` (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `path` varchar(255) NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `sourcecode` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '源代码',
  `desc` varchar(255) NOT NULL,
  `code` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '编译后代码',
  `style` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '编译后样式',
  `dependencies` longtext,
  `less` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '样式代码',
  `model` longtext COMMENT 'dva状态',
  `modelcode` longtext COMMENT '编译后的model',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;

```

## umi-cms

> 项目与页面的配置后台

- 项目列表
- 项目增删改
- 页面列表
- 页面增删改
- jsx 与 less 代码编辑
- 配置应用实时预览
- 代码格式化
- 支持 dva 状态管理，编写 model
- 代码校验

## umi-app

> 后台配置的项目通过该应用展示

- 通过项目 code 加载不同项目
- 通过页面路径，加载不同页面配置
- 动态加载接口返回的页面组件代码与样式
- 支持内部组件的引入
- 支持 dva 状态管理

## TODO

- 请求
- 工具方法
