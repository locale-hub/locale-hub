import Joi from 'joi';

export const inviteUserRequest = Joi.object({
  name: Joi
    .string()
    .required(),
  primaryEmail: Joi
    .string()
    .email()
    .required(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
