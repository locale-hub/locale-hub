import { Request, Response, Router as createRouter } from 'express';
import argon2 from 'argon2';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import rateLimit from 'express-rate-limit';
import fs from 'fs/promises';

import {
  authenticate,
  generateAuthToken,
} from '../logic/middlewares/auth.middleware';
import { validateRequest } from '../logic/middlewares/validateRequest.middleware';
import * as MailService from '../logic/services/mail.service';
import { sendError } from '../logic/helpers/sendError.helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { jwtService } from '../logic/services/jwt.service';
import { passwordResetSchema } from '@locale-hub/data/requests/passwordReset.request';
import { UserRepository } from '@locale-hub/data/repositories/user.repository';
import { createUserSchema } from '@locale-hub/data/requests/createUser.request';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { OrganizationRepository } from '@locale-hub/data/repositories/organization.repository';
import { loginUserSchema } from '@locale-hub/data/requests/loginUser.request';
import { JwtModel } from '@locale-hub/data/models/jwt.model';
import { passwordResetApplySchema } from '@locale-hub/data/requests/passwordResetApply.request';
import { ApiException } from '@locale-hub/data/exceptions/api.exception';
import { environment } from '../../environments/environment';

const registerRateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 2, // max requests per IP
  skipSuccessfulRequests: true,
});

const loginRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // max requests per IP
  skipSuccessfulRequests: true,
});

const resetRequestRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // max requests per IP
});

const refreshTokenRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // max requests per IP
}); // ~13 minutes

const router = createRouter({ mergeParams: true });
const userRepository = new UserRepository();
const organizationRepository = new OrganizationRepository();

let commonPasswords: string[] = [];

const secret = Buffer.from(environment.security.password.secret, 'utf8');

/**
 * Register new user
 */
router.post(
  '/register',
  registerRateLimiter,
  validateRequest(createUserSchema),
  async function (req: Request, res: Response) {
    try {
      if (await isCommonPassword(req.body.user.password)) {
        return sendError(
          res,
          new ApiException({
            statusCode: 400,
            code: ErrorCode.userPasswordWeak,
            message: 'Weak password',
          })
        );
      }

      const salt = await crypto.randomBytes(
        environment.security.password.saltLength
      );
      const password = await argon2.hash(req.body.user.password, {
        type: argon2.argon2id,
        salt,
        secret,
      });

      const user = await userRepository.insert(
        req.body.user.name,
        req.body.user.primaryEmail,
        password,
        salt.toString()
      );

      await organizationRepository.insert(
        uuid(), // orgId
        user.id,
        'My personal org'
      );

      MailService.send(
        user.primaryEmail,
        'Welcome to i18n Services',
        'auth.welcome',
        {
          userName: user.name,
        }
      );

      const token = await generateAuthToken({ user });

      res.json({
        token,
      });
    } catch (error) {
      sendError(res, error as Error);
    }
  }
);

/**
 * Login route
 */
router.post(
  '/login',
  loginRateLimiter,
  validateRequest(loginUserSchema),
  async function (req: Request, res: Response) {
    try {
      const user = await userRepository.findByEmail(req.body.primaryEmail);

      const passCorrect = await argon2.verify(
        user.password,
        req.body.password,
        {
          type: argon2.argon2id,
          salt: Buffer.from(user.passwordSalt, 'utf8'),
          secret,
        }
      );
      if (!passCorrect) {
        return sendError(
          res,
          new ApiException({
            statusCode: 404,
            code: ErrorCode.userNotFound,
            message: 'User not found',
          })
        );
      }
      const token = await generateAuthToken({ user });

      res.json({
        token,
      });
    } catch (error) {
      sendError(res, error as Error);
    }
  }
);

/**
 * Request password reset process
 */
router.post(
  '/password-reset',
  resetRequestRateLimiter,
  validateRequest(passwordResetSchema),
  async function (req: Request, res: Response) {
    try {
      const email = req.body.primaryEmail;
      const user = await userRepository.findByEmail(email);
      const userName = user.name;

      user.name = '';
      user.password = '';
      user.passwordSalt = '';
      const token = await generateAuthToken({ user });
      const url = `${environment.portal.web.uri}${environment.portal.web.routes.passwordReset}/${token}`;

      MailService.send(
        user.primaryEmail,
        'Password reset request',
        'auth.password-reset-request',
        {
          userName: userName,
          url: url,
        }
      );

      res.status(204).send();
    } catch (error) {
      sendError(res, error as Error);
    }
  }
);

/**
 * Apply the password reset request
 */
router.post(
  '/password-reset/apply',
  resetRequestRateLimiter,
  validateRequest(passwordResetApplySchema),
  async function (req: Request, res: Response) {
    try {
      const token = req.body.token;
      const email = req.body.primaryEmail;
      const password = req.body.password;

      if (await isCommonPassword(password)) {
        return sendError(
          res,
          new ApiException({
            statusCode: 400,
            code: ErrorCode.userPasswordWeak,
            message: 'Weak password',
          })
        );
      }

      const decoded = await jwtService.read<JwtModel>(token);
      if (decoded.user.primaryEmail !== email) {
        // email does not match token email value
        return sendError(
          res,
          new ApiException({
            statusCode: 400,
            code: ErrorCode.requestInvalid,
            message: 'Invalid email provided',
          })
        );
      }

      const oldUser = await userRepository.findByEmail(email);

      oldUser.password = await argon2.hash(req.body.password, {
        type: argon2.argon2id,
        salt: Buffer.from(oldUser.passwordSalt, 'utf8'),
        secret,
      });
      const user = await userRepository.update(oldUser.id, oldUser);

      MailService.send(
        user.primaryEmail,
        'Password updated',
        'auth.password-reset-apply',
        {
          userName: user.name,
        }
      );

      const newToken = await generateAuthToken({ user });

      res.json({
        token: newToken,
      });
    } catch (error) {
      sendError(res, error as Error);
    }
  }
);

/**
 * Refresh Json Web Token given
 */
router.post(
  '/refresh-token',
  refreshTokenRateLimiter,
  authenticate,
  async function (req: Request, res: Response) {
    try {
      const loginExpiration = dayjs(req.jwt.lastLogin)
        .clone()
        .add(environment.security.password.expirationInDays, 'days');
      const now = dayjs(new Date()).utc();

      if (loginExpiration.diff(now) < 0) {
        // if expiration date is past (from now)
        return sendError(
          res,
          new ApiException({
            statusCode: 401,
            code: ErrorCode.userAccessExpired,
            message: 'User authentication has expired, please login again',
          })
        );
      }

      const newToken = await generateAuthToken({
        user: req.jwt.user,
        lastLogin: req.jwt.lastLogin,
      });

      res.json({
        token: newToken,
      });
    } catch (error) {
      sendError(res, error as Error);
    }
  }
);

const isCommonPassword = async (password: string): Promise<boolean> => {
  if (0 === commonPasswords.length) {
    commonPasswords = (
      await fs.readFile(
        `${__dirname}/${environment.security.password.forbiddenList}`,
        'utf8'
      )
    ).split('\n');
  }

  return commonPasswords.includes(password);
};

export default router;
