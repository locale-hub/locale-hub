'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { ApiConnector } from '@locale-hub/api-connector';
import { redirect } from 'next/navigation';
import { routes } from '../constants/routes';

const AuthContext = createContext({
  loggedIn: false,
  user: null,
  login: (_email: string, _password: string) => {},
  logout: () => {},
  register: (_name: string, _email: string, _password: string) => {}
});

export const AuthContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  let refreshInterval;
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const previousUser = ApiConnector.auth.getUser();
    setUser(previousUser);
    setLoggedIn(null !== previousUser);
  }, []);

  useEffect(() => {
    if (loggedIn) {
      refreshInterval = setInterval(() => {
        ApiConnector.auth.refreshToken();
        // TODO: delay in config
      }, 13 * 60 * 1000);
    }
    else {
      clearInterval(refreshInterval)
    }
  }, [loggedIn]);

  const register = async (name: string, email: string, password: string) => {
    const user = await ApiConnector.auth.register(name, email, password);
    if ('error' in user) {
      // TODO: display error
      console.error('Failed to register', user);
      return;
    }
    setUser(user);
    setLoggedIn(true);
  }

  const login = async (email: string, password: string) => {
    const user = await ApiConnector.auth.login(email, password);
    if ('error' in user) {
      // TODO: display error
      console.error('Failed to sign in', user);
      return;
    }
    setUser(user);
    setLoggedIn(true);
  }

  const logout = async () => {
    await ApiConnector.auth.logout();
    setUser(null);
    setLoggedIn(false);
    // TODO: improve error handling
    try { useEffect(() => redirect(routes.auth), []) } catch (e) {}
  }

  const value = { loggedIn, user, register, login, logout };

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>;
}

export default AuthContext;

export const useAuth = () => useContext(AuthContext);
