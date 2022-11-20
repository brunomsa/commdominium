import axios, { AxiosError } from 'axios';
import * as next from 'next';
import * as express from 'express';
import { parseCookies } from 'nookies';

import { ApiError } from './api';

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
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return api;
}

export function catchError(error: any) {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError;
    return { ok: false, error: err.response.data as ApiError };
  } else {
    return {
      ok: false,
      error: { error: `${error}` },
    };
  }
}

export function catchPageError(error: any) {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError;
    return { props: { ok: false, messageError: err.response.data as ApiError } };
  } else {
    return {
      props: {
        ok: false,
        messageError: { error: `${error}` },
      },
    };
  }
}
