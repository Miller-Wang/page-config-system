import { request } from 'umi';

export const getProjects = () => request('/api/projects');

export const getProjectInfo = (id: string) => request(`/api/project/${id}`);

export const addProject = (params: any) =>
  request(`/api/addProject`, {
    method: 'post',
    data: params,
    skipErrorHandler: true,
  });

export const updateProject = (params: any) =>
  request(`/api/updateProject/${params.id}`, {
    method: 'post',
    data: params,
    skipErrorHandler: true,
  });

export const delProject = (id: string) =>
  request(`/api/project/${id}`, { method: 'delete' });

export const getPages = (pid: string) => request(`/api/${pid}/pages`);

export const getPageDetail = (id: string) => request(`/api/page/${id}`);

export const addPage = (pid: string, params: any) =>
  request(`/api/${pid}/addPage`, {
    method: 'post',
    data: params,
    skipErrorHandler: true,
  });

export const updatePage = (pid: string, id: string, params: any) =>
  request(`/api/${pid}/updatePage/${id}`, {
    method: 'post',
    data: params,
    skipErrorHandler: true,
  });

export const delPage = (id: string) =>
  request(`/api/page/${id}`, { method: 'delete' });
