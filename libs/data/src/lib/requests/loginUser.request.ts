import Joi from 'joi';

export const loginUserSchema = Joi.object({
  primaryEmail: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
