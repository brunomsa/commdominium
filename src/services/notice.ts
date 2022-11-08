import { Moment } from 'moment';
import { api, ApiResponse } from './api';
import { catchError } from './axios';
import { BASE_API_URL } from './constants';

export type Notice = {
  id: number;
  title: string;
  message: string;
  eventDay?: string | Moment;
  id_noticeType: number;
  id_condominium: number;
  updatedAt?: string | Date;
};

export type NoticeForm = Omit<Notice, 'id' | 'updatedAt'> & {
  eventDay?: Moment;
};

export async function createNotice(notice: NoticeForm): Promise<ApiResponse<Notice>> {
  const noticeData = {
    ...notice,
    eventDay: notice.eventDay?.format('YYYY-MM-DD'),
  };
  try {
    const { status, data } = await api.post<Notice>(`${BASE_API_URL}/notices/register`, noticeData);
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function getNoticeById(id: number): Promise<ApiResponse<Notice>> {
  try {
    const { status, data } = await api.post<Notice>(`${BASE_API_URL}/notices/findById`, { id });
    if (status === 204) return { ok: true, error: { error: 'Aviso inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function updateNotice(notice: Notice): Promise<ApiResponse<Notice>> {
  try {
    const { status, data } = await api.patch<Notice>(`${BASE_API_URL}/notices/update`, notice);
    if (status === 204) return { ok: true, error: { error: 'Aviso inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function deleteNotice(id: number): Promise<ApiResponse<{ status: string }>> {
  try {
    const { status, data } = await api.delete<{ status: string }>(`${BASE_API_URL}/notices/delete`, {
      data: { id },
    });
    if (status === 204) return { ok: true, error: { error: 'Aviso inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}
