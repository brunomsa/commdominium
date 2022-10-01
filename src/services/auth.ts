import axios from 'axios';
import { v4 as uuid } from 'uuid';

type SignInRequestData = {
  email: string;
  password: string;
};

const delay = (amount = 750) =>
  new Promise((resolve) => setTimeout(resolve, amount));

export async function signInRequest(data: SignInRequestData) {
  await delay();

  axios
    .post(
      'https://x1quq6njif.execute-api.us-east-1.amazonaws.com/prod/searchlogin',
      {
        login: data.email,
        senha: data.password,
      }
    )
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });

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
