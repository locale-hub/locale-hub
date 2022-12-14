export const globalConfiguration = {
  production: false,
  environment: 'development',
  version: '3.0.0',

  features: {
    sdk: true,
    sentry: false,
  },

  database: {
    name: 'locale-hub',
    uri: 'mongodb://lh-user:lh-password@localhost:27017',
  },

  documentation: {
    root: 'https://locale-hub.gitbook.io/',
    sdk: 'https://doc.locale-hub.com/sdk/overview',
  },

  email: {
    from: 'EMAIL',
    host: 'HOST',
    port: 587,
    secure: false,
    auth: {
      user: 'YOUR_EMAIL',
      password: 'YOUR_PASSWORD',
    },
    resources: {
      html: './resources/emails/html/',
      text: './resources/emails/text/',
    },
  },

  portal: {
    api: {
      uri: 'http://localhost:3000/v1',
      port: 3000,
    },
    web: {
      refreshTokenInterval: 13 * 60 * 1000, // 13 minutes
      uri: `http://localhost:4201`,
      port: 4201,
      routes: {
        login: '/login',
        passwordReset: '/auth/password-reset',
      },
    },
  },

  public: {
    web: {
      hostname: 'http://localhost:4202',
      releasesRoute: '/releases',
    },
  },

  // if features.sdk = true
  sdk: {
    // if features.sdk = true
    redis: {
      uri: 'redis://localhost:6379/0',
    },
  },

  security: {
    cors: {
      origin: 'http://localhost:4200',
    },
    jwt: {
      expiresIn: '1d', // seconds or string [zeit/ms](https://github.com/zeit/ms.js)
      audience: 'locale-hub',
      issuer: 'locale-hub',
    },
    password: {
      forbiddenList: './resources/files/passwords.txt',
      expirationInDays: 31,
      minLength: 8,
      secret: 'YOUR_OWN_SECRET',
      saltLength: 16,
    },
  },

  // if features.sentry = true
  sentry: {
    uri: undefined,
  },
};
