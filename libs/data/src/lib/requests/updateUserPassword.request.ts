import Joi from 'joi';

export const updateUserPasswordSchema = Joi.object({
  old: Joi
    .string()
    .required(),
  new: Joi
    .string()
    .min(8)
    .max(32)
    .required(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
