import Joi from 'joi';

export const passwordResetApplySchema = Joi.object({
  token: Joi.string().required(),
  primaryEmail: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
