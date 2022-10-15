import axios, { AxiosError } from 'axios';
import { ApiError, User } from '../contexts/types';
import { BASE_API_URL } from './constants';

export async function createUser(user: Omit<User, 'id'>) {
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
