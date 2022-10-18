import axios, { AxiosError } from 'axios';
import { ApiError } from '../contexts/types';
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
    const { status, data } = await axios.post<User>(`${BASE_API_URL}/user/register`, userData);
    if (status === 200) return { ok: true, data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      return { ok: false, error: err.response.data as ApiError };
    } else {
      return {
        ok: false,
        error: { error: `Um inesperado erro ocorreu: ${error}` },
      };
    }
  }
}
