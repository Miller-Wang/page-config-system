const Controller = require('egg').Controller;

class ProjectController extends Controller {
  // 项目信息
  async getProjectInfo() {
    const { ctx } = this;
    const id = ctx.params.id;
    const project = await this.app.mysql.get('project', { id });
    const pages = await this.app.mysql.select('pages', {
      where: { project_id: id },
    });

    if (!project) {
      ctx.body = {
        success: false,
        msg: '项目不存在',
      };
    } else {
      project.pages = pages || [];
      ctx.body = {
        success: true,
        data: project,
      };
    }
  }

  // 项目列表
  async getAllProjects() {
    const { ctx, app } = this;
    let projects = await app.mysql.select('project');
    ctx.body = {
      success: true,
      data: projects,
    };
  }

  // 添加项目
  async addProject() {
    const { ctx, app } = this;
    const projectObj = ctx.request.body;
    // 校验字段 项目名、项目描述之类
    // 校验code是否重复

    const project = await this.app.mysql.get('project', {
      code: projectObj.code,
    });
    if (project) {
      ctx.body = {
        success: false,
        msg: '项目code不能重复，请使用其他code',
      };
      return;
    }

    const res = await app.mysql.insert('project', projectObj);
    ctx.body = {
      success: true,
      data: {
        id: res.insertId,
      },
    };
  }

  // 更新项目
  async updateProject() {
    const { ctx, app } = this;
    const updateData = {
      id: ctx.params.id,
      ...ctx.request.body,
    };

    const project = await this.app.mysql.get('project', {
      code: updateData.code,
    });
    if (project && project.id !== updateData.id) {
      ctx.body = {
        success: false,
        msg: '项目code不能重复，请使用其他code',
      };
      return;
    }

    const res = await app.mysql.update('project', updateData);
    if (res.changedRows === 1) {
      ctx.body = {
        success: true,
        data: res,
      };
    } else {
      ctx.body = {
        success: false,
        msg: '找不到id',
      };
    }
  }

  // 删除项目
  async delProject() {
    const { ctx, app } = this;
    const res = app.mysql.delete('project', {
      id: ctx.params.id,
    });

    ctx.body = {
      success: true,
      data: res,
    };
  }
}

module.exports = ProjectController;
