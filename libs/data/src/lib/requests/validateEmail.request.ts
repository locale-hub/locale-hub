import Joi from 'joi';

export const validateEmailSchema = Joi.object({
  token: Joi
    .string()
    .required(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
