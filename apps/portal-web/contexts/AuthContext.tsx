'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { ApiConnector } from '@locale-hub/api-connector';
import { User } from '@locale-hub/data';
import { redirect } from 'next/navigation';
import { routes } from '../constants/routes';
import decode from 'jwt-decode';

const AuthContext = createContext({
  loggedIn: false,
  user: null,
  login: (_email: string, _password: string) => {},
  logout: () => {},
  register: () => {}
});

export const AuthContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const previousUser = null !== token
      ? (decode(token) as any).user as User
      : null;

    setUser(previousUser);
    setLoggedIn(null !== previousUser);
  }, []);

  const register = () => {
    setUser({ name: 'John Doe', email: 'some@email.con' });
    setLoggedIn(true);
  }

  const login = async (email: string, password: string) => {
    const user = await ApiConnector.login(email, password);
    if ('error' in user) {
      // TODO: display error
      console.error('Failed to sign in', user);
      return;
    }
    setUser(user);
    setLoggedIn(true);
  }

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoggedIn(false);
    redirect(routes.auth);
  }

  const value = { loggedIn, user, register, login, logout };

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>;
}

export default AuthContext;

export const useAuth = () => useContext(AuthContext);
