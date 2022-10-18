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

type CreateUserResponse = {
  ok: boolean;
  data?: User;
  error?: ApiError;
};

export async function createUser(user: Omit<User, 'id'>): Promise<CreateUserResponse> {
  try {
    const userData: Omit<User, 'id'> = {
      ...user,
      active: true,
    };
    const { data } = await api.post<User>(`${BASE_API_URL}/user/register`, userData);
    if (data) return { ok: true, data };
  } catch (error) {
    catchError(error);
  }
}

export async function getUserById(id: number): Promise<ApiResponse<User>> {
  try {
    const { data } = await api.post<User>(`${BASE_API_URL}/user/findById`, { id });
    if (data) return { ok: true, data };
  } catch (error) {
    catchError(error);
  }
}
