import { NextFunction, Request, Response } from 'express';

import _ from 'lodash';
import { sendError } from '../helpers/sendError.helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { jwtService } from '../services/jwt.service';
import { UserRepository } from '@locale-hub/data/repositories/user.repository';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { UserInvitation } from '@locale-hub/data/models/user-invitation.model';
import { JwtModel } from '@locale-hub/data/models/jwt.model';
import { ApiException } from '@locale-hub/data/exceptions/api.exception';

const userRepository = new UserRepository();

/**
 * Validate the submitted JsonWebToken
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @param {NextFunction} next Express NextFunction
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token: string = req.headers['authorization'] as string;

  try {
    const jwtData = await jwtService.read<JwtModel>(
      token.replace('Bearer ', '')
    );

    if (!(await userExists(jwtData.user.id))) {
      sendError(
        res,
        new ApiException({
          statusCode: 401,
          code: ErrorCode.userAccessUnauthorized,
          message: 'Unauthorized',
        })
      );
      return;
    }

    req.user = jwtData.user;
    req.jwt = jwtData;
    next();
  } catch (ex) {
    sendError(
      res,
      new ApiException({
        statusCode: 401,
        code: ErrorCode.userAccessUnauthorized,
        message: 'Unauthorized',
      })
    );
  }
};

/**
 * Generate a JsonWebToken from the user model
 * @param {JwtModel} bias data to use to generate a new JsonWebToken
 * @return {string} The new JsonWebToken
 */
export const generateAuthToken = async (bias: JwtModel): Promise<string> => {
  const lastLogin =
    undefined !== bias.lastLogin ? bias.lastLogin : dayjs().utc().toISOString();
  return await jwtService.sign({
    user: _.omit(bias.user, ['_id', 'password', 'passwordSalt']),
    lastLogin,
  });
};

export const generateEmailConfirmationToken = async (
  invitation: UserInvitation
): Promise<string> => {
  return await jwtService.sign({
    invitation,
  });
};

/**
 * Confirm that the given userId exists in database
 * @param {string} userId The user id to validate
 * @return {boolean} true if user exists, false otherwise
 */
const userExists = async (userId: string): Promise<boolean> => {
  try {
    await userRepository.find(userId);
    return true;
  } catch (e) {
    return false;
  }
};
