import { SignInData } from '../contexts/types';
import { api, ApiResponse } from './api';
import { catchError } from './axios';
import { BASE_API_URL } from './constants';
import { getUserById, User } from './user';

type SignInResponse = {
  token: string;
  user: User;
};

export async function signInRequest(values: SignInData): Promise<ApiResponse<SignInResponse>> {
  try {
    const { status, data } = await api.post<SignInResponse>(`${BASE_API_URL}/auth/authenticate`, values);
    if (status.toString().startsWith('2') && data) return { ok: true, data: { token: data.token, user: data.user } };
  } catch (error) {
    return catchError(error);
  }
}

export async function recoverUserInfo(token: string): Promise<ApiResponse<User>> {
  const authorization = `Bearer ${token}`;
  try {
    const { status, data } = await api.get<User>(`${BASE_API_URL}/queryToken`, {
      headers: { Authorization: authorization },
    });
    if (status.toString().startsWith('2') && data) {
      return getUserById(data.id).then(({ ok, data, error }) => {
        if (!ok && error) return { ok: false, error };
        if (data) return { ok: true, data };
      });
    }
  } catch (error) {
    return catchError(error);
  }
}
