import Joi from 'joi';

export const updateProjectSchema = Joi.object({
  name: Joi
    .string()
    .min(3)
    .max(32)
    .required(),
  defaultLocale: Joi
    .string()
    .optional(),
  description: Joi
    .string()
    .min(0)
    .max(256)
    .empty('')
    .optional(),
  archived: Joi
    .boolean()
    .optional(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
