import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { sendError } from '../helpers/sendError.helper';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { ApiException } from '@locale-hub/data/exceptions/api.exception';

type MiddlewareFunc = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Validate that the request follows the given schema
 * @param {Joi.ObjectSchema} schema The schema the request should follow
 * @return {MiddlewareFunc} Middleware function
 */
export const validateRequest = (schema: Joi.ObjectSchema): MiddlewareFunc => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validation = await schema.validate(req.body);

      if (undefined !== validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        return sendError(
          res,
          new ApiException({
            statusCode: 400,
            code: ErrorCode.requestInvalid,
            message: 'Invalid request',
            errors,
          })
        );
      }

      next();
    } catch (err) {
      return sendError(
        res,
        new ApiException({
          statusCode: 400,
          code: ErrorCode.requestInvalid,
          message: 'Invalid request',
        })
      );
    }
  };
};
