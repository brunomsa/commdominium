import axios, { AxiosError } from 'axios';
import { v4 as uuid } from 'uuid';
import { SignInError, User } from '../contexts/types';
import { API_URL } from './constants';

type SignInRequestData = {
  login: string;
  password: string;
};

type SignInResponseData = {
  token: string;
  user: User;
};

type SignInResponse = {
  ok: boolean;
  data?: SignInResponseData;
  error?: SignInError;
};

const delay = (amount = 750) =>
  new Promise((resolve) => setTimeout(resolve, amount));

export async function signInRequest(
  signInData: SignInRequestData
): Promise<SignInResponse> {
  try {
    const { status, data: user } = await axios.post<User>(
      `${API_URL}/auth/searchlogin`,
      signInData
    );
    if (status === 200) return { ok: true, data: { token: uuid(), user } };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      return { ok: false, error: err.response.data as SignInError };
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
    IDusuario: 1,
    nome: 'Igor Sena',
    bloco: '',
    predio: '',
    numero: 'Rua Suiça',
    login: 'igorsenamarques@hotmail.com',
    senha: '12345',
    ativo: true,
    IDtipo_usuario: 2,
    IDcondominio: 1,
    createdAt: '2022-10-02T10:53:12.000Z',
    updatedAt: '2022-10-02T10:53:12.000Z',
  };
}
