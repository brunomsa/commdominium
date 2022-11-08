import { getApiClient } from './axios';

export type ApiError = {
  error: string;
};

export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: ApiError;
  status?: number;
};

export const api = getApiClient();
