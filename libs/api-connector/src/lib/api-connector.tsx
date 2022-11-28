'use client';
import decode from 'jwt-decode';

import { ApiErrorResponse, Project, ProjectsListResponse, TokenResponse, User } from '@locale-hub/data';
import { Http } from './http';
import { MeDashboardResponse } from '../../../data/src/lib/responses/me-dashboard.response';
import { ProjectsGetResponse } from '../../../data/src/lib/responses/projects-get.response';

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
      http.setToken(token);
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
      http.setToken(token);
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
      http.setToken(token);
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
      http.setToken(token);
      localStorage.setItem('token', token);
      return (decode(token) as any).user as User;
    },
  },

  me: {
    dashboard: async (): Promise<MeDashboardResponse | ApiErrorResponse> => {
      return await http.get<MeDashboardResponse>('/me/dashboard');
    },
  },

  projects: {
    list: async (): Promise<Project[] | ApiErrorResponse> => {
      const res = await http.get<ProjectsListResponse>('/projects');
      if ('error' in res) {
        return res as ApiErrorResponse;
      }

      return res.projects;
    },
    get: async (projectId: string): Promise<ProjectsGetResponse | ApiErrorResponse> => {
      return await http.get<ProjectsGetResponse>(`/projects/${projectId}`);
    },
    delete: async (projectId: string): Promise<null | ApiErrorResponse> => {
      return await http.delete<unknown, null | ApiErrorResponse>(`/projects/${projectId}`);
    },
  }

};
