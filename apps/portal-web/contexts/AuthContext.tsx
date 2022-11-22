'use client';
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  loggedIn: false,
  user: null,
  register: () => {},
  login: () => {},
  logout: () => {}
});

export const AuthContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const register = () => {
    setUser({ name: 'John Doe', email: 'some@email.con' });
    setLoggedIn(true);
  }
  const login = () => {
    setUser({ name: 'John Doe', email: 'some@email.con' });
    setLoggedIn(true);
  }
  const logout = () => {
    setUser(null);
    setLoggedIn(false);
  }
  const value = { loggedIn, user, register, login, logout };

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>;
}

export default AuthContext;

export const useAuth = () => useContext(AuthContext);
