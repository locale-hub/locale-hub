export const routes = {
  root: '/',
  auth: {
    root: '/auth',
    passwordReset: '/auth/password-reset',
    passwordResetApply: (token: string) => `/auth/password-reset/${token}`,
  },
  dashboard: '/dashboard',
  profiles: {
    me: '/profiles/me',
  },
  organizations: {
    root: '/organizations',
    projects: (organizationId: string) =>
      `/organizations/${organizationId}/projects`,
    users: (organizationId: string) => `/organizations/${organizationId}/users`,
    usage: (organizationId: string) => `/organizations/${organizationId}/usage`,
    settings: (organizationId: string) =>
      `/organizations/${organizationId}/settings`,
  },
  projects: {
    root: '/projects',
    applications: (projectId: string) => `/projects/${projectId}/applications`,
    commits: {
      list: (projectId: string) => `/projects/${projectId}/commits`,
      get: (projectId: string, commitId: string) =>
        `/projects/${projectId}/commits/${commitId}`,
    },
    overview: (projectId: string) => `/projects/${projectId}`,
    settings: (projectId: string) => `/projects/${projectId}/settings`,
    transfers: (projectId: string) => `/projects/${projectId}/transfers`,
    translations: (projectId: string) => `/projects/${projectId}/translations`,
    users: (projectId: string) => `/projects/${projectId}/users`,
  },
};
