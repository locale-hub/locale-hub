import { globalConfiguration as config } from '@locale-hub/config';

export const environment = {
  production: config.production,
  environment: config.environment,
  version: config.version,

  features: {
    sdk: config.features.sdk,
    sentry: config.features.sentry,
  },

  database: config.database,
  email: config.email,
  portal: {
    api: config.portal.api,
    web: {
      uri: config.portal.web.uri,
      routes: config.portal.web.routes
    }
  },
  sdk: config.sdk,
  security: config.security,
  sentry: config.sentry,
};
