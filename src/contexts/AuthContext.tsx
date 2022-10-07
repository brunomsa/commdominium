import { createContext, useEffect, useState } from 'react';

import Router from 'next/router';
import { setCookie, parseCookies } from 'nookies';

import { recoverUserInfo, signInRequest } from '../services/auth';
import { api } from '../services/api';
import { SignInData, User } from './types';

type AuthContextType = {
  isAuthenticated: boolean;
  user?: User;
  signIn: (data: SignInData) => Promise<{ ok: boolean; error: string }>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User>();

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'commdominium.token': token } = parseCookies();

    if (token) {
      recoverUserInfo().then((reponse) => setUser(reponse));
    }
  }, []);

  async function signIn({ login, password }: SignInData) {
    const { ok, data, error } = await signInRequest({
      login,
      password,
    });

    if (!ok && !data && error) return { ok: false, ...error };

    setCookie(undefined, 'commdominium.token', data.token, {
      maxAge: 60 * 60 * 1, // 1 hour
    });

    api.defaults.headers['Authorization'] = `Bearer ${data.token}`;

    setUser(data.user);

    Router.push('/');

    return { ok, error: undefined };
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
