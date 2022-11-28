
export const routes = {
  root: '/',
  auth: '/auth',
  'auth.password-reset': '/auth/password-reset',
  dashboard: '/dashboard',
  organizations: {
    root: '/organizations',
    projects: (organizationId: string) => `/organizations/${organizationId}/projects`,
    users: (organizationId: string) => `/organizations/${organizationId}/users`,
    usage: (organizationId: string) => `/organizations/${organizationId}/usage`,
    settings: (organizationId: string) => `/organizations/${organizationId}/settings`,
  },
  projects: {
    root: '/projects',
    applications: (projectId: string) => `/projects/${projectId}/applications`,
    commits: (projectId: string) => `/projects/${projectId}/commits`,
    overview: (projectId: string) => `/projects/${projectId}`,
    settings: (projectId: string) => `/projects/${projectId}/settings`,
    transfers: (projectId: string) => `/projects/${projectId}/transfers`,
    translations: (projectId: string) => `/projects/${projectId}/translations`,
    users: (projectId: string) => `/projects/${projectId}/users`,
  },
}
