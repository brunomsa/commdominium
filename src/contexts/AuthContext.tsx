import { createContext, PropsWithChildren, useEffect, useState } from 'react';

import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

import { recoverUserInfo, signInRequest } from '../services/auth';
import { api } from '../services/api';
import { getUserById, User } from '../services/user';

import { SignInData } from './types';
import { message } from 'antd';

type AuthContextType = {
  isAuthenticated: boolean;
  user?: User;
  signIn: (data: SignInData) => Promise<{ ok: boolean; error: string }>;
  signOut: () => void;
};

const TOKEN_KEY = 'commdominium.token';

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User>();

  const isAuthenticated = !!user;

  useEffect(() => {
    (async () => {
      const { TOKEN_KEY: token } = parseCookies();

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

    setCookie(undefined, TOKEN_KEY, data.token, {
      maxAge: 60 * 60 * 6, // 6 hours
    });

    api.defaults.headers['Authorization'] = `Bearer ${data.token}`;

    setUser(data.user);

    Router.push('/');

    return { ok, error: undefined };
  }

  function signOut() {
    destroyCookie(undefined, TOKEN_KEY);
    Router.push('/login');
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>{children}</AuthContext.Provider>;
}
