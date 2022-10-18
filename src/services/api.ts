import { getApiClient } from './axios';

export type ApiError = {
  error: string;
};

export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: ApiError;
};

export const api = getApiClient();
