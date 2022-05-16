'use strict';

const Controller = require('egg').Controller;
const transformCode = require('../utils/transformCode');

class PagesController extends Controller {
  async getPages() {
    const { ctx } = this;
    const id = ctx.params.id;
    const data = await this.app.mysql.select('pages', {
      where: { project_id: id },
    });
    ctx.body = {
      success: true,
      data,
    };
  }

  async pageDetail() {
    const { ctx } = this;
    const id = ctx.params.id;
    const data = await this.app.mysql.get('pages', { id });

    ctx.body = {
      success: true,
      data: data,
    };
  }

  // 根据页面路径获取页面详情
  async getDetailByPath() {
    const { ctx } = this;
    const code = ctx.params.code;
    const path = ctx.query.path;
    // 关联的是项目id，要先通过项目code获取项目id
    const project = await this.app.mysql.get('project', { code });
    if (!project) {
      ctx.body = {
        success: false,
        msg: '页面不存在',
      };
      return;
    }
    const pages = await this.app.mysql.select('pages', {
      where: { project_id: project.id },
    });

    if (pages && pages.length > 0) {
      const data = pages.find((v) => v.path === path);
      if (data) {
        ctx.body = {
          success: true,
          data,
        };
        return;
      }
    }
    ctx.body = {
      success: false,
      msg: '页面不存在',
    };
  }

  async addPage() {
    const { ctx } = this;
    const projectId = ctx.params.projectId;
    const page = ctx.request.body;
    page.project_id = parseInt(projectId);

    // 校验保存数据
    try {
      const list = await this.app.mysql.select('pages', {
        where: { project_id: projectId },
      });

      if (list.find((v) => v.path === page.path)) {
        ctx.body = {
          success: false,
          msg: '同一项目页面路径不能重复',
        };
        return;
      }

      // 转换组件代码
      page.code = await transformCode(page);

      const res = await this.app.mysql.insert('pages', page);
      ctx.body = {
        success: true,
        data: {
          id: res.insertId,
        },
      };
    } catch (error) {
      ctx.body = {
        success: false,
        msg: error.toString(),
      };
    }
  }

  async updatePage() {
    const { ctx } = this;
    const { projectId, id } = ctx.params;

    const page = ctx.request.body;
    page.project_id = parseInt(projectId);

    // 校验保存数据
    try {
      const list = await this.app.mysql.select('pages', {
        where: { project_id: projectId },
      });

      if (list.find((v) => v.id !== parseInt(id) && v.path === page.path)) {
        ctx.body = {
          success: false,
          msg: '同一项目页面路径不能重复',
        };
        return;
      }

      // 转换组件代码
      page.code = await transformCode(page);

      page.id = parseInt(id);
      const res = await this.app.mysql.update('pages', page);
      ctx.body = {
        success: true,
        data: {
          id: res.insertId,
        },
      };
    } catch (error) {
      ctx.body = {
        success: false,
        msg: error.toString(),
      };
    }
  }

  // 删除页面
  async delPage() {
    const { ctx, app } = this;
    const { id } = ctx.params;

    const res = app.mysql.delete('pages', { id });

    ctx.body = {
      success: true,
      data: res,
    };
  }
}

module.exports = PagesController;
