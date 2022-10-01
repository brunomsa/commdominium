import { createContext, useEffect, useState } from 'react';
import { recoverUserInfo, signInRequest } from '../services/auth';
import Router from 'next/router';

import { setCookie, parseCookies } from 'nookies';
import { api } from '../services/api';

type User = {
  name: string;
  email: string;
  avatar_url: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user?: User;
  signIn: (data: SignInData) => Promise<void>;
};

type SignInData = {
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User>();

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'commdominium.token': token } = parseCookies();

    if (token) {
      recoverUserInfo().then((reponse) => setUser(reponse.user));
    }
  }, []);

  async function signIn({ email, password }: SignInData) {
    const { token, user } = await signInRequest({
      email,
      password,
    });

    setCookie(undefined, 'commdominium.token', token, {
      maxAge: 60 * 60 * 1, // 1 hour
    });

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    setUser(user);

    Router.push('/');
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
