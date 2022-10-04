import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { API_URL } from './constants';

type SignInRequestData = {
  login: string;
  password: string;
};

const delay = (amount = 750) =>
  new Promise((resolve) => setTimeout(resolve, amount));

export async function signInRequest(signInData: SignInRequestData) {
  try {
    const { status, data } = await axios.post<SignInRequestData>(
      `${API_URL}/auth/searchlogin`,
      signInData
    );
    console.log({ status, data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.message;
    } else {
      throw `An unexpected error occurred: ${error}`;
    }
  }

  return {
    token: uuid(),
    user: {
      name: 'Bruno Andrade',
      email: 'bruno.andrade@gmail.com',
      avatar_url: 'https://github.com/brunomsa.png',
    },
  };
}

export async function recoverUserInfo() {
  await delay();

  return {
    user: {
      name: 'Bruno Andrade',
      email: 'bruno.andrade@gmail.com',
      avatar_url: 'https://github.com/brunomsa.png',
    },
  };
}
