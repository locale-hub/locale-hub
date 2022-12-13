import Joi from 'joi';

export const updateUserSchema = Joi.object({
  user: Joi.object({
    name: Joi
      .string()
      .min(3)
      .max(32)
      .required(),
    primaryEmail: Joi
      .string()
      .email()
      .required(),
    emails: Joi
      .array()
      .required(),
  }).required(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
