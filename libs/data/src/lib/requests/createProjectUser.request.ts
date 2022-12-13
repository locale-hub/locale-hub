import Joi from 'joi';
import {UserRoles} from '../enums/user-roles.enum';

export const createProjectUserSchema = Joi.object({
  userId: Joi
    .string()
    .uuid()
    .required(),
  role: Joi
    .string()
    .valid(...Object.values(UserRoles))
    .required(),
}).options({
  abortEarly: false,
  allowUnknown: true,
});
