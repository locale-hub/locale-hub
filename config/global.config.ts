
export const globalConfiguration = {
  production: false,
  environment: 'development',
  version: '3.0.0',

  features: {
    sdk: true,
    sentry: false,
  },

  documentation: {
    root: 'https://locale-hub.gitbook.io/',
    sdk: 'https://doc.locale-hub.com/sdk/overview'
  },

  portal: {
    api: {
      uri: 'http://localhost:3000/v1',
    },
    web: {
      refreshTokenInterval: 13 * 60 * 1000, // 13 minutes
      uri: 'http://localhost:4201',
    }
  },

  public: {
    web: {
      hostname: 'http://localhost:4202',
      releasesRoute: '/releases'
    }
  },

  // if features.sentry = true
  sentry: {
    uri: '',
  },
};
