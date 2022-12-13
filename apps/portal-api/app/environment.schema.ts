import Joi from 'joi';

export const environmentSchema = Joi.object({
  production: Joi.boolean().required(),
  environment: Joi.valid('production', 'development').required(),
  version: Joi.string().required(),

  features: Joi.object({
    sdk: Joi.boolean().required(),
    sentry: Joi.boolean().required(),
  }).required(),

  database: Joi.object({
    name: Joi.string().required(),
    uri: Joi.string().required(),
  }).required(),

  email: Joi.object({
    from: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().required(),
    secure: Joi.boolean().required(),

    auth: Joi.object({
      user: Joi.string().required(),
      password: Joi.string().required(),
    }).required(),

    resources: Joi.object({
      html: Joi.string().required(),
      text: Joi.string().required(),
    }).required(),
  }).required(),

  portal: {
    api: Joi.object({
      uri: Joi.string().required(),
      port: Joi.number().port().required(),
    }).required(),
    web: Joi.object({
      uri: Joi.string().required(),
      routes: Joi.object({
        login: Joi.string().required(),
        passwordReset: Joi.string().required(),
      }).required(),
    }).required(),
  },

  sdk: Joi.object({
    redis: Joi.object({
      uri: Joi.string().optional(),
    }).optional(),
  }).optional(),

  security: Joi.object({

    cors: Joi.object({
      origin: Joi.string().required(),
    }).required(),

    jwt: Joi.object({
      expiresIn: Joi.string().required(),
      audience: Joi.string().required(),
      issuer: Joi.string().required(),
    }).required(),

    password: Joi.object({
      forbiddenList: Joi.string().required(),
      expirationInDays: Joi.number().required(),
      minLength: Joi.number().required(),
      secret: Joi.string().required(),
      saltLength: Joi.number().required(),
    }).required(),
  }).required(),

  sentry: Joi.object({
    uri: Joi.string().optional(),
  }).optional(),
}).required();
