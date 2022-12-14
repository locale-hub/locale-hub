import Joi from 'joi';

export const createOrgSchema = Joi.object({
  organization: Joi.object({
    name: Joi.string().min(3).max(32).required(),
  }).required(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
