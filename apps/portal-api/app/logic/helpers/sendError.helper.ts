import {Response} from 'express';
import * as Sentry from '@sentry/node';

import { environment } from '../../../environments/environment';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { ApiException } from '@locale-hub/data/exceptions/api.exception';
import { ApiError } from '@locale-hub/data/models/api-error.model';

const sentryIgnoredStatusCodes = [
  401, 404,
];

const formatError = (exception: ApiException | Error): ApiError => {
  if (exception instanceof ApiException) {
    return exception.error;
  }

  return {
    code: ErrorCode.serverError,
    message: 'Something went wrong',
    statusCode: 500,
  };
};

/**
 * Send a normalized error response
 * @param {Response} res Express Response object
 * @param {ApiException | Error} exception An error that contains all elements for normalized response
 */
export const sendError = (res: Response, exception: ApiException | Error): void => {
  console.error(exception);

  const error: ApiError = formatError(exception);
  const ignoreErrorTracking = sentryIgnoredStatusCodes.includes(error.statusCode);

  if (environment.features.sentry && !ignoreErrorTracking) {
    Sentry.captureException(exception);
  }

  res.status(error.statusCode).json({
    error,
  });
};
