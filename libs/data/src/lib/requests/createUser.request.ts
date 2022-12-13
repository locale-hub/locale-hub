import Joi from 'joi';

export const createUserSchema = Joi.object({
  user: {
    name: Joi
      .string()
      .min(3)
      .max(32)
      .required(),
    primaryEmail: Joi
      .string()
      .email()
      .required(),
    password: Joi
      .string()
      .min(8) // TODO: should come from config
      .required(),
  },
}).options({
  abortEarly: false,
  allowUnknown: true,
});
