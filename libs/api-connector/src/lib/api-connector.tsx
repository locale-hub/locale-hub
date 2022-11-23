
import decode from 'jwt-decode';

import { ApiErrorResponse, TokenResponse, User } from '@locale-hub/data';
import { Http } from './http';

// TODO: replace with config based value
const http = new Http('http://localhost:3000/v1');

export const ApiConnector = {

  auth: {
    getUser: (): User | null => {
      const token = localStorage.getItem('token');
      return null !== token
        ? (decode(token) as any).user as User
        : null;
    },

    login: async (primaryEmail: string, password: string): Promise<User | ApiErrorResponse> => {
      const res = await http.post<any, TokenResponse>(
        '/auth/login',
        { primaryEmail, password }
      );
      if ('error' in res) {
        return res as ApiErrorResponse;
      }

      const token = res.token;
      localStorage.setItem('token', token);
      return (decode(token) as any).user as User;
    },

    logout: async (): Promise<void> => {
      localStorage.removeItem('token');
    },

    refreshToken: async (): Promise<User | ApiErrorResponse> => {
      const res = await http.post<any, TokenResponse>('/auth/refresh-token');
      if ('error' in res) {
        return res as ApiErrorResponse;
      }

      const token = res.token;
      localStorage.setItem('token', token);
      return (decode(token) as any).user as User;
    },

    register: async (name: string, primaryEmail: string, password: string): Promise<User | ApiErrorResponse> => {
      const res = await http.post<any, TokenResponse>(
        '/auth/register',
        { user: { name, primaryEmail, password } }
      );
      if ('error' in res) {
        return res as ApiErrorResponse;
      }

      const token = res.token;
      localStorage.setItem('token', token);
      return (decode(token) as any).user as User;
    },

    resetPassword: async (primaryEmail: string): Promise<void | ApiErrorResponse> => {
      const res = await http.post<any, any>(
        '/auth/password-reset',
        { primaryEmail }
      );
      if ('error' in res) {
        return res as ApiErrorResponse;
      }
    },

    resetPasswordApply: async (resetToken: string, primaryEmail: string, password: string): Promise<User | ApiErrorResponse> => {
      const res = await http.post<any, TokenResponse>(
        '/auth//apply',
        { primaryEmail, resetToken, password }
      );
      if ('error' in res) {
        return res as ApiErrorResponse;
      }

      const token = res.token;
      localStorage.setItem('token', token);
      return (decode(token) as any).user as User;
    },
  }

};
