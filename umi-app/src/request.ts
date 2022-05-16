import { request } from 'umi';

export const getPageDetail = (id: string) =>
  request(
    `/api/${id}/page?path=${window.location.pathname.replace(`/${id}`, '')}`,
    {
      skipErrorHandler: true,
    },
  );

export const getComponents = () =>
  request(`/api/project/5`, {
    skipErrorHandler: true,
  });
