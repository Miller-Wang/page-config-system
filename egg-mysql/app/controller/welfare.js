const Controller = require('egg').Controller;

class WelfareController extends Controller {
  async addPage() {
    const { ctx, app } = this;
    // name path config
    const projectObj = ctx.request.body;

    const project = await this.app.mysql.get('welfare', {
      path: projectObj.path,
    });
    if (project) {
      ctx.body = {
        success: false,
        message: '页面路径不能重复',
      };
      return;
    }

    const res = await app.mysql.insert('welfare', projectObj);
    ctx.body = {
      success: true,
      code: '0',
      data: {
        id: res.insertId,
      },
    };
  }

  async updatePage() {
    const { ctx, app } = this;

    const updateData = {
      id: ctx.params.id,
      ...ctx.request.body,
    };

    const project = await this.app.mysql.get('welfare', {
      path: updateData.path,
    });
    if (project && project.path !== updateData.path) {
      ctx.body = {
        success: false,
        message: '页面路径不能重复',
      };
      return;
    }

    const res = await app.mysql.update('welfare', updateData);
    ctx.body = {
      code: '0',
      success: true,
      data: res,
    };
  }

  async getPage() {
    const { ctx } = this;
    const id = ctx.params.id;
    const project = await this.app.mysql.get('welfare', { id });
    if (!project) {
      ctx.body = {
        success: false,
        msg: '页面不存在',
      };
    } else {
      ctx.body = {
        code: '0',
        success: true,
        data: project,
      };
    }
  }

  // h5页面配置
  async getPageDetail() {
    const {
      ctx: { query },
      ctx,
    } = this;

    const project = await this.app.mysql.get('welfare', { path: query.path });
    if (!project) {
      ctx.body = {
        errorCode: 0,
        message: '页面不存在',
      };
    } else {
      const pageData = JSON.parse(project.config);
      ctx.body = {
        errorCode: 0,
        message: '操作成功',
        data: {
          global: JSON.parse(pageData.global),
          extra: JSON.parse(pageData.ext),
          config: JSON.parse(pageData.page),
          path: query.path,
          is_entry: 1,
        },
      };
    }
  }

  async getPages() {
    const { ctx } = this;
    const pages = await this.app.mysql.select('welfare');
    ctx.body = {
      code: '0',
      success: true,
      data: pages || [],
    };
  }

  async delPage() {
    const { ctx, app } = this;
    const res = app.mysql.delete('welfare', {
      id: ctx.params.id,
    });

    ctx.body = {
      code: '0',
      success: true,
      data: res,
    };
  }
}

module.exports = WelfareController;
