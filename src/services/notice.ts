import { api, ApiResponse } from './api';
import { catchError } from './axios';
import { BASE_API_URL } from './constants';

export type Notice = {
  id: number;
  message: string;
  id_noticeType: number;
  id_condominium: number;
  updatedAt: string;
};

export async function createNotice(notice: Omit<Notice, 'id'>): Promise<ApiResponse<Notice>> {
  try {
    const { status, data } = await api.post<Notice>(`${BASE_API_URL}/notices/register`, notice);
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}
