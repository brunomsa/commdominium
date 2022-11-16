import { api, ApiResponse } from './api';
import { catchError } from './axios';
import { BASE_API_URL } from './constants';

export type User = {
  id: number;
  fullname: string;
  email: string;
  id_condominium: number;
  id_userType: number;
  block?: string;
  building?: string;
  number: string;
  active: boolean;
  avatarArchive?: string;
};

export interface UserForm extends Omit<User, 'id'> {
  confirm?: string;
}

export async function createUser(user: Omit<User, 'id'>): Promise<ApiResponse<User>> {
  try {
    const { status, data } = await api.post<User>('/user/register', user);
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function getUserById(id: number): Promise<ApiResponse<User>> {
  try {
    const { status, data } = await api.post<User>('/user/findById', { id });
    if (status === 204) return { ok: true, error: { error: 'Usuário inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function updateUser(user: Omit<User, 'active'>): Promise<ApiResponse<User>> {
  try {
    const { status, data } = await api.patch<User>('/user/update', user);
    if (status === 204) return { ok: true, error: { error: 'Usuário inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function updateActiveStatus(id_user: number): Promise<ApiResponse<{ status: string }>> {
  try {
    const { status, data } = await api.patch('/services/updateActiveStatus', { id_user });
    if (status === 204) return { ok: true, error: { error: '   inexistente' } };
    if (status === 200) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function deleteUser(id: number): Promise<ApiResponse<{ status: string }>> {
  try {
    const { status, data } = await api.delete<{ status: string }>('/user/delete', { data: { id } });
    if (status === 204) return { ok: true, error: { error: 'Usuário inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}
