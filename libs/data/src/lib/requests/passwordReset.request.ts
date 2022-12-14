import Joi from 'joi';

export const passwordResetSchema = Joi.object({
  primaryEmail: Joi.string().email().required(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
