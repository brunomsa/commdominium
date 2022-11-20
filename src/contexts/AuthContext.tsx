import { createContext, Dispatch, PropsWithChildren, SetStateAction, useEffect, useState } from 'react';

import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

import { message } from 'antd';

import { api } from '../services/api';
import { recoverUserInfo, signInRequest } from '../services/auth';
import { User } from '../services/user';
import { SignInData } from './types';

type AuthContextType = {
  isAuthenticated: boolean;
  user?: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  signIn: (data: SignInData) => Promise<{ ok: boolean; error: string }>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User>();

  const isAuthenticated = !!user;

  useEffect(() => {
    (async () => {
      const { ['commdominium.token']: token } = parseCookies();

      if (token) {
        const { ok, data, error } = await recoverUserInfo(token);
        if (!ok && error) return message.error(error.error);
        setUser(data);
      }
    })();
  }, []);

  async function signIn({ email, password }: SignInData) {
    const { ok, data, error } = await signInRequest({
      email,
      password,
    });

    if (!ok && !data && error) return { ok: false, ...error };

    setCookie(undefined, 'commdominium.token', data.token, {
      maxAge: 60 * 60 * 6, // 6 hours
    });

    api.defaults.headers['Authorization'] = `Bearer ${data.token}`;

    setUser(data.user);

    Router.push('/');

    return { ok, error: undefined };
  }

  async function signOut() {
    console.log(user);
    // destroyCookie(undefined, 'commdominium.token');
    setUser(undefined);
    await Router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}
