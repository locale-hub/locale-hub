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
  CommitsListResponse,
  AppsListResponse,
  AppsPostResponse,
  FileFormat,
  ManifestsGetResponse,
  ProjectsGetResponse,
  ManifestWithStatus,
  Manifest,
  MeNotificationsResponse,
  OrganizationsListResponse,
  ProjectsPostResponse, OrganizationsPostResponse
} from '@locale-hub/data';
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

  notifications: {
    list: async (): Promise<MeNotificationsResponse | ApiErrorResponse> => {
      return await http.get<MeNotificationsResponse>('/notifications');
    },
    discard: async (notificationId: string): Promise<null | ApiErrorResponse> => {
      return await http.delete<void, null | ApiErrorResponse>(`/notifications/${notificationId}`);
    }
  },

  organizations: {
    list: async (): Promise<OrganizationsListResponse | ApiErrorResponse> => {
      return await http.get<OrganizationsListResponse>('/organizations');
    },
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
    },
    post: async (name: string): Promise<OrganizationsPostResponse | ApiErrorResponse> => {
      return await http.post<any, OrganizationsPostResponse | ApiErrorResponse>(
        '/organizations',
        {
          organization: { name }
        }
      );
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
    post: async (organizationId: string, name: string, defaultLocale: string): Promise<ProjectsPostResponse | ApiErrorResponse> => {
      return await http.post<any, ProjectsPostResponse | ApiErrorResponse>(
        '/projects',
        {
          organizationId,
          name,
          defaultLocale
        }
      );
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

    applications: {
      list: async (projectId: string): Promise<AppsListResponse | ApiErrorResponse> => {
        return await http.get<AppsListResponse>(`/projects/${projectId}/apps`);
      },
      delete: async (projectId: string, appId: string): Promise<null | ApiErrorResponse> => {
        return await http.delete<unknown, null | ApiErrorResponse>(`/projects/${projectId}/apps/${appId}`);
      },
      create: async (projectId: string, name: string, identifier: string) => {
        return await http.post<any, AppsPostResponse | ApiErrorResponse>(
          `/projects/${projectId}/apps`,
          {
            name,
            type: 'other',
            identifier
          }
        );
      }
    },
    bundles: {
      get: async (projectId: string, format: FileFormat): Promise<Blob | ApiErrorResponse> => {
        return await http.getBlob(`/projects/${projectId}/bundles?format=${format}`);
      },
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
      },
      post: async (projectId: string, manifest: ManifestWithStatus, title: string, description: string): Promise<void | ApiErrorResponse> => {
        return await http.post<{ title: string, description: string, changeList: ManifestWithStatus }, void | ApiErrorResponse>(
          `/projects/${projectId}/commits`,
          { title, description, changeList: manifest }
        );
      }
    },
    manifests: {
      get: async (projectId: string): Promise<ManifestsGetResponse | ApiErrorResponse> => {
        return await http.get(`/projects/${projectId}/manifests`);
      },
    },
  }

};
