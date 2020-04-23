import * as http from 'http';

import { constant } from '~/constant';

export const get_request = async (url: string, req: http.IncomingMessage) => {
  let _option = '';
  if (!process.client) {
    _option = req.headers.cookie;
  }

  return await fetch(`${constant.REQUEST_URL[process.env.NODE_ENV]}${url}`, {
    method: 'get',
    credentials: 'include',
    headers: { ...constant.HEADER, ...{ cookie: _option } },
  });
};

export const post_request = async (url: string, params: {}) => {
  return await fetch(`${constant.REQUEST_URL[process.env.NODE_ENV]}${url}`, {
    method: 'post',
    headers: constant.HEADER,
    credentials: 'include',
    body: JSON.stringify(params),
  });
};

export const put_request = async (url: string, params: {}) => {
  return await fetch(`${constant.REQUEST_URL[process.env.NODE_ENV]}${url}`, {
    method: 'put',
    headers: constant.HEADER,
    credentials: 'include',
    body: JSON.stringify(params),
  });
};

export const delete_request = async (url: string, params: {}) => {
  return await fetch(`${constant.REQUEST_URL[process.env.NODE_ENV]}${url}`, {
    method: 'delete',
    headers: constant.HEADER,
    credentials: 'include',
    body: JSON.stringify(params),
  });
};
