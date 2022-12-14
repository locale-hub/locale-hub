import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().min(3).max(32).required(),
  organizationId: Joi.string().required(),
  defaultLocale: Joi.string().optional(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
