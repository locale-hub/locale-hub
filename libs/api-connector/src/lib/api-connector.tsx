'use client';
import decode from 'jwt-decode';

import { Http } from './http';
import { ProjectsGetResponse } from '@locale-hub/data/responses/projects-get.response';
import { Organization } from '@locale-hub/data/models/organization.model';
import { OrganizationsPostResponse } from '@locale-hub/data/responses/organizations-post.response';
import { FileFormat } from '@locale-hub/data/enums/file-format.enum';
import { OrganizationsProjectsGetResponse } from '@locale-hub/data/responses/organizations-projects-get.response';
import { MeNotificationsResponse } from '@locale-hub/data/responses/me-notifications.response';
import { AppsPostResponse } from '@locale-hub/data/responses/apps-post.response';
import { ManifestsGetResponse } from '@locale-hub/data/responses/manifests-get.response';
import { OrganizationsListResponse } from '@locale-hub/data/responses/organizations-list.response';
import { ProjectsListResponse } from '@locale-hub/data/responses/projects-list.response';
import { ProjectsUsersGetResponse } from '@locale-hub/data/responses/projects-users-get.response';
import { CommitsListResponse } from '@locale-hub/data/responses/commits-list.response';
import { UserRoles } from '@locale-hub/data/enums/user-roles.enum';
import { CommitsGetResponse } from '@locale-hub/data/responses/commits-get.response';
import { ApiErrorResponse } from '@locale-hub/data/responses/api-error.response';
import { MeDashboardResponse } from '@locale-hub/data/responses/me-dashboard.response';
import { OrganizationsGetResponse } from '@locale-hub/data/responses/organizations-get.response';
import { OrganizationsUsageGetResponse } from '@locale-hub/data/responses/organizations-usage-get.response';
import { Project } from '@locale-hub/data/models/project.model';
import { ProjectsPostResponse } from '@locale-hub/data/responses/projects-post.response';
import { TokenResponse } from '@locale-hub/data/responses/token.response';
import { ManifestWithStatus } from '@locale-hub/data/models/manifest-with-status.model';
import { AppsListResponse } from '@locale-hub/data/responses/apps-list.response';
import { OrganizationsUsersGetResponse } from '@locale-hub/data/responses/organizations-users-get.response';
import { User } from '@locale-hub/data/models/user.model';

let http: Http;

export const ApiConnector = {
  initApi: (baseUrl: string, authUrl: string) => {
    http = new Http(baseUrl, authUrl);
  },

  auth: {
    getUser: (): User | null => {
      const token = localStorage.getItem('token');
      return null !== token ? ((decode(token) as any).user as User) : null;
    },

    login: async (
      primaryEmail: string,
      password: string
    ): Promise<User | ApiErrorResponse> => {
      const res = await http.post<any, TokenResponse>('/auth/login', {
        primaryEmail,
        password,
      });
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

    register: async (
      name: string,
      primaryEmail: string,
      password: string
    ): Promise<User | ApiErrorResponse> => {
      const res = await http.post<any, TokenResponse>('/auth/register', {
        user: { name, primaryEmail, password },
      });
      if ('error' in res) {
        return res as ApiErrorResponse;
      }

      const token = res.token;
      http.setToken(token);
      localStorage.setItem('token', token);
      return (decode(token) as any).user as User;
    },

    resetPassword: async (
      primaryEmail: string
    ): Promise<void | ApiErrorResponse> => {
      const res = await http.post<any, any>('/auth/password-reset', {
        primaryEmail,
      });
      if ('error' in res) {
        return res as ApiErrorResponse;
      }
    },

    resetPasswordApply: async (
      resetToken: string,
      primaryEmail: string,
      password: string
    ): Promise<User | ApiErrorResponse> => {
      const res = await http.post<any, TokenResponse>('/auth/apply', {
        primaryEmail,
        resetToken,
        password,
      });
      if ('error' in res) {
        return res as ApiErrorResponse;
      }

      const token = res.token;
      http.setToken(token);
      localStorage.setItem('token', token);
      return (decode(token) as any).user as User;
    },
    validateEmail: async (token: string): Promise<User | ApiErrorResponse> => {
      const res = await http.post<any, TokenResponse>('/me/validate-email', {
        token,
      });
      if ('error' in res) {
        return res as ApiErrorResponse;
      }

      const resToken = res.token;
      http.setToken(resToken);
      localStorage.setItem('token', resToken);
      return (decode(resToken) as any).user as User;
    },
  },

  me: {
    dashboard: async (): Promise<MeDashboardResponse | ApiErrorResponse> => {
      return await http.get<MeDashboardResponse>('/me/dashboard');
    },
    update: async (user: User): Promise<User | ApiErrorResponse> => {
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
    updatePassword: async (
      oldPassword: string,
      newPassword: string
    ): Promise<null | ApiErrorResponse> => {
      const res = await http.put<any, any>('/me/password', {
        old: oldPassword,
        new: newPassword,
      });
      if ('error' in res) {
        return res as ApiErrorResponse;
      }
      return null;
    },
  },

  notifications: {
    list: async (): Promise<MeNotificationsResponse | ApiErrorResponse> => {
      return await http.get<MeNotificationsResponse>('/notifications');
    },
    discard: async (
      notificationId: string
    ): Promise<null | ApiErrorResponse> => {
      return await http.delete<void, null | ApiErrorResponse>(
        `/notifications/${notificationId}`
      );
    },
  },

  organizations: {
    list: async (): Promise<OrganizationsListResponse | ApiErrorResponse> => {
      return await http.get<OrganizationsListResponse>('/organizations');
    },
    get: async (
      organizationId: string
    ): Promise<OrganizationsGetResponse | ApiErrorResponse> => {
      return await http.get<OrganizationsGetResponse>(
        `/organizations/${organizationId}`
      );
    },
    projects: async (
      organizationId: string
    ): Promise<OrganizationsProjectsGetResponse | ApiErrorResponse> => {
      return await http.get<OrganizationsProjectsGetResponse>(
        `/organizations/${organizationId}/projects`
      );
    },
    update: async (
      organization: Organization
    ): Promise<null | ApiErrorResponse> => {
      return await http.put<Organization, null | ApiErrorResponse>(
        `/organizations/${organization.id}`,
        organization
      );
    },
    usage: async (
      organizationId: string
    ): Promise<OrganizationsUsageGetResponse | ApiErrorResponse> => {
      return await http.get<OrganizationsUsageGetResponse>(
        `/organizations/${organizationId}/usage`
      );
    },
    delete: async (
      organizationId: string
    ): Promise<null | ApiErrorResponse> => {
      return await http.delete<void, null | ApiErrorResponse>(
        `/organizations/${organizationId}`
      );
    },
    post: async (
      name: string
    ): Promise<OrganizationsPostResponse | ApiErrorResponse> => {
      return await http.post<any, OrganizationsPostResponse | ApiErrorResponse>(
        '/organizations',
        {
          organization: { name },
        }
      );
    },
    users: {
      list: async (
        organizationId: string
      ): Promise<OrganizationsUsersGetResponse | ApiErrorResponse> => {
        return await http.get<OrganizationsUsersGetResponse>(
          `/organizations/${organizationId}/users`
        );
      },
      invite: async (
        organizationId: string,
        name: string,
        email: string
      ): Promise<null | ApiErrorResponse> => {
        return await http.post<any, null | ApiErrorResponse>(
          `/organizations/${organizationId}/users/invite`,
          {
            name,
            primaryEmail: email,
          }
        );
      },
      delete: async (
        organizationId: string,
        userId: string
      ): Promise<null | ApiErrorResponse> => {
        return await http.delete<any, null | ApiErrorResponse>(
          `/organizations/${organizationId}/users/${userId}`
        );
      },
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
    get: async (
      projectId: string
    ): Promise<ProjectsGetResponse | ApiErrorResponse> => {
      return await http.get<ProjectsGetResponse>(`/projects/${projectId}`);
    },
    post: async (
      organizationId: string,
      name: string,
      defaultLocale: string
    ): Promise<ProjectsPostResponse | ApiErrorResponse> => {
      return await http.post<any, ProjectsPostResponse | ApiErrorResponse>(
        '/projects',
        {
          organizationId,
          name,
          defaultLocale,
        }
      );
    },
    update: async (project: Project): Promise<null | ApiErrorResponse> => {
      return await http.put<Project, null | ApiErrorResponse>(
        `/organizations/${project.id}`,
        project
      );
    },
    delete: async (projectId: string): Promise<null | ApiErrorResponse> => {
      return await http.delete<unknown, null | ApiErrorResponse>(
        `/projects/${projectId}`
      );
    },
    users: {
      list: async (
        projectId: string
      ): Promise<ProjectsUsersGetResponse | ApiErrorResponse> => {
        return await http.get<ProjectsUsersGetResponse>(
          `/projects/${projectId}/users`
        );
      },
      delete: async (
        projectId: string,
        userId: string
      ): Promise<null | ApiErrorResponse> => {
        return await http.delete<any, null | ApiErrorResponse>(
          `/projects/${projectId}/users/${userId}`
        );
      },
      add: async (
        projectId: string,
        userId: string
      ): Promise<null | ApiErrorResponse> => {
        return await http.post<any, null | ApiErrorResponse>(
          `/projects/${projectId}/users`,
          {
            userId,
            role: UserRoles.USER,
          }
        );
      },
    },
    applications: {
      list: async (
        projectId: string
      ): Promise<AppsListResponse | ApiErrorResponse> => {
        return await http.get<AppsListResponse>(`/projects/${projectId}/apps`);
      },
      delete: async (
        projectId: string,
        appId: string
      ): Promise<null | ApiErrorResponse> => {
        return await http.delete<unknown, null | ApiErrorResponse>(
          `/projects/${projectId}/apps/${appId}`
        );
      },
      create: async (projectId: string, name: string, identifier: string) => {
        return await http.post<any, AppsPostResponse | ApiErrorResponse>(
          `/projects/${projectId}/apps`,
          {
            name,
            type: 'other',
            identifier,
          }
        );
      },
    },
    bundles: {
      get: async (
        projectId: string,
        format: FileFormat
      ): Promise<Blob | ApiErrorResponse> => {
        return await http.getBlob(
          `/projects/${projectId}/bundles?format=${format}`
        );
      },
    },
    commits: {
      list: async (
        projectId: string
      ): Promise<CommitsListResponse | ApiErrorResponse> => {
        return await http.get<CommitsListResponse>(
          `/projects/${projectId}/commits`
        );
      },
      publish: async (
        projectId: string,
        commitId: string
      ): Promise<null | ApiErrorResponse> => {
        return await http.put<{ deployed: boolean }, null | ApiErrorResponse>(
          `/projects/${projectId}/commits/${commitId}`,
          { deployed: true }
        );
      },
      post: async (
        projectId: string,
        manifest: ManifestWithStatus,
        title: string,
        description: string
      ): Promise<null | ApiErrorResponse> => {
        return await http.post<
          {
            title: string;
            description: string;
            changeList: ManifestWithStatus;
          },
          null | ApiErrorResponse
        >(`/projects/${projectId}/commits`, {
          title,
          description,
          changeList: manifest,
        });
      },
      get: async (
        projectId: string,
        commitId: string
      ): Promise<CommitsGetResponse | ApiErrorResponse> => {
        return await http.get<CommitsGetResponse>(
          `/projects/${projectId}/commits/${commitId}`
        );
      },
    },
    manifests: {
      get: async (
        projectId: string
      ): Promise<ManifestsGetResponse | ApiErrorResponse> => {
        return await http.get(`/projects/${projectId}/manifests`);
      },
    },
  },
};
