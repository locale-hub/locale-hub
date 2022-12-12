import { globalConfiguration as config } from '@locale-hub/config';

export const environment = {
  production: config.production,
  environment: config.environment,
  version: config.version,

  features: {
    sdk: config.features.sdk,
    sentry: config.features.sentry,
  },

  documentation: config.documentation,

  portal: config.portal,

  sentry: config.sentry,
};
