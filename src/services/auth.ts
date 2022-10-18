import axios, { AxiosError } from 'axios';
import { SignInData, ApiError } from '../contexts/types';
import { BASE_API_URL } from './constants';
import { User } from './user';

type SignInResponseData = {
  token: string;
  user: User;
};

type SignInResponse = {
  ok: boolean;
  data?: SignInResponseData;
  error?: ApiError;
};

const delay = (amount = 750) => new Promise((resolve) => setTimeout(resolve, amount));

export async function signInRequest(signInData: SignInData): Promise<SignInResponse> {
  try {
    const { status, data } = await axios.post<SignInResponseData>(`${BASE_API_URL}/auth/authenticate`, signInData);
    if (status === 200) return { ok: true, data: { token: data.token, user: data.user } };
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

export async function recoverUserInfo(): Promise<User> {
  await delay();

  return {
    id: 1,
    fullname: 'Igor Sena',
    block: '',
    building: '',
    number: '2',
    email: 'igorsenamarques@hotmail.com',
    active: true,
    id_userType: 3,
    id_condominium: 1,
  };
}
