'use client';
import decode from 'jwt-decode';

import {
  ApiErrorResponse,
  MeDashboardResponse,
  OrganizationsUsersGetResponse,
  OrganizationsProjectsGetResponse,
  Project,
  ProjectsListResponse,
  TokenResponse,
  User,
  ProjectsUsersGetResponse,
  OrganizationsGetResponse,
  Organization,
  OrganizationsUsageGetResponse,
  CommitsListResponse, Commit
} from '@locale-hub/data';
import { Http } from './http';
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
        '/auth/apply',
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
    update:  async (user: User): Promise<User | ApiErrorResponse> => {
      const res = await http.put<any, TokenResponse>('/me', { user });
      if ('error' in res) {
        return res as ApiErrorResponse;
      }

      const token = res.token;
      http.setToken(token);
      localStorage.setItem('token', token);
      return (decode(token) as any).user as User;
    },
    self: async (): Promise<User> => {
      const token = localStorage.getItem('token')!;
      return (decode(token) as any).user as User;
    },
    updatePassword: async (oldPassword: string, newPassword: string): Promise<null | ApiErrorResponse> => {
      const res = await http.put<any, any>('/me/password', { old: oldPassword, new: newPassword });
      if ('error' in res) {
        return res as ApiErrorResponse;
      }
      return null;
    }
  },

  organizations: {
    get: async (organizationId: string): Promise<OrganizationsGetResponse | ApiErrorResponse> => {
      return await http.get<OrganizationsGetResponse>(`/organizations/${organizationId}`);
    },
    projects: async (organizationId: string): Promise<OrganizationsProjectsGetResponse | ApiErrorResponse> => {
      return await http.get<OrganizationsProjectsGetResponse>(`/organizations/${organizationId}/projects`);
    },
    users: async (organizationId: string): Promise<OrganizationsUsersGetResponse | ApiErrorResponse> => {
      return await http.get<OrganizationsUsersGetResponse>(`/organizations/${organizationId}/users`);
    },
    update: async (organization: Organization): Promise<void | ApiErrorResponse> => {
      return await http.put<Organization, void | ApiErrorResponse>(
        `/organizations/${organization.id}`,
        organization
      );
    },
    usage: async (organizationId: string): Promise<OrganizationsUsageGetResponse | ApiErrorResponse> => {
      return await http.get<OrganizationsUsageGetResponse>(`/organizations/${organizationId}/usage`);
    },
    delete: async (organizationId: string): Promise<void | ApiErrorResponse> => {
      return await http.delete<void, void | ApiErrorResponse>(`/organizations/${organizationId}`);
    }
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
    update: async (project: Project): Promise<void | ApiErrorResponse> => {
      return await http.put<Project, void | ApiErrorResponse>(
        `/organizations/${project.id}`,
        project
      );
    },
    delete: async (projectId: string): Promise<null | ApiErrorResponse> => {
      return await http.delete<unknown, null | ApiErrorResponse>(`/projects/${projectId}`);
    },
    users: async (projectId: string): Promise<ProjectsUsersGetResponse | ApiErrorResponse> => {
      return await http.get<ProjectsUsersGetResponse>(`/projects/${projectId}/users`);
    },

    commits: {
      list: async (projectId: string): Promise<CommitsListResponse | ApiErrorResponse> => {
        return await http.get<CommitsListResponse>(`/projects/${projectId}/commits`);
      },
      publish: async (projectId: string, commitId: string): Promise<void | ApiErrorResponse> => {
        return await http.put<{ deployed: boolean }, void | ApiErrorResponse>(
          `/projects/${projectId}/commits/${commitId}`,
          { deployed: true }
        );
      }
    }
  }

};
