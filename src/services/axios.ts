import axios from 'axios';
import * as next from 'next';
import * as express from 'express';

import { parseCookies } from 'nookies';
import { API_URL } from './constants';

export function getApiClient(
  ctx?:
    | Pick<next.NextPageContext, 'req'>
    | {
        req: next.NextApiRequest;
      }
    | {
        req: express.Request;
      }
) {
  const { 'commdominium.token': token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: API_URL,
  });

  api.interceptors.request.use((config) => {
    console.log(config);
    return config;
  });

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return api;
}
