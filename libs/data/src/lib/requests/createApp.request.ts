import Joi from 'joi';
import {AppType} from '../enums/app-type.enum';

export const createAppSchema = Joi.object({
  name: Joi
    .string()
    .regex(/^\w+( +\w+)*$/)
    .min(3)
    .max(32)
    .required(),
  type: Joi
    .string()
    .valid(...Object.values(AppType))
    .required(),
  identifier: Joi
    .string()
    .trim()
    .min(4)
    .required(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
