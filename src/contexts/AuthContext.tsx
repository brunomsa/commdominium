import { createContext, PropsWithChildren, useEffect, useState } from 'react';

import Router from 'next/router';
import { setCookie, parseCookies } from 'nookies';

import { recoverUserInfo, signInRequest } from '../services/auth';
import { api } from '../services/api';
import { getUserById, User } from '../services/user';

import { SignInData } from './types';
import { message } from 'antd';

type AuthContextType = {
  isAuthenticated: boolean;
  user?: User;
  signIn: (data: SignInData) => Promise<{ ok: boolean; error: string }>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User>();

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'commdominium.token': token } = parseCookies();

    if (token) {
      recoverUserInfo(token).then((res) => {
        if (!res?.ok && res?.error) return message.error(res?.error.error);
        setUser(res?.data);
      });
    }
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

  return <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>{children}</AuthContext.Provider>;
}
