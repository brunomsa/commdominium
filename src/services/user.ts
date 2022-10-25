import { api, ApiError, ApiResponse } from './api';
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
};

export interface UserData extends Omit<User, 'id' | 'active'> {
  confirm?: string;
}

export async function createUser(user: Omit<User, 'id' | 'active'>): Promise<ApiResponse<User>> {
  try {
    const userData: Omit<User, 'id'> = {
      ...user,
      active: true,
    };
    const { status, data } = await api.post<User>(`${BASE_API_URL}/user/register`, userData);
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function getUserById(id: number): Promise<ApiResponse<User>> {
  try {
    const { status, data } = await api.post<User>(`${BASE_API_URL}/user/findById`, { id });
    if (status === 204) return { ok: true, error: { error: 'Usuário inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function updateUser(user: Omit<User, 'active'>): Promise<ApiResponse<User>> {
  try {
    const userData: User = {
      ...user,
      active: true,
    };
    const { status, data } = await api.patch<User>(`${BASE_API_URL}/user/update`, userData);
    if (status === 204) return { ok: true, error: { error: 'Usuário inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}

export async function deleteUser(id: number): Promise<ApiResponse<{ status: string }>> {
  try {
    const { status, data } = await api.delete<{ status: string }>(`${BASE_API_URL}/user/delete`, { data: { id } });
    if (status === 204) return { ok: true, error: { error: 'Usuário inexistente' } };
    if (status === 200 && data) return { ok: true, data };
  } catch (error) {
    return catchError(error);
  }
}
