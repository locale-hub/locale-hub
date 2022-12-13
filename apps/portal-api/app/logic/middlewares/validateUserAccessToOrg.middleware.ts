import {NextFunction, Request, Response} from 'express';
import * as OrganizationService from '../services/organization.service';
import {sendError} from '../helpers/sendError.helper';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { ApiException } from '@locale-hub/data/exceptions/api.exception';
import { User } from '@locale-hub/data/models/user.model';

/**
 * Validate that the authenticated user has access to organization
 * Requires req.user to be set (authenticate middleware)
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @param {NextFunction} next Express NextFunction
 */
export const validateUserAccessToOrg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user: User = req.user;

    const organizationId: string = req.params.organizationId;
    if (undefined === organizationId || null === organizationId) {
      return sendError(res, new ApiException({
        statusCode: 400,
        code: ErrorCode.requestInvalid,
        message: 'OrganizationId not found in url',
      }));
    }

    const organization = await OrganizationService.getOrganization(organizationId);
    if (null === organization) {
      return sendError(res, new ApiException({
        statusCode: 404,
        code: ErrorCode.organizationNotFound,
        message: 'User organization cannot be found',
      }));
    }

    const orgHasUser = organization.users.some((userEmail) => {
      return user.emails.map((u) => u.email).includes(userEmail);
    });
    if (!orgHasUser) {
      return sendError(res, new ApiException({
        statusCode: 403,
        code: ErrorCode.userAccessForbidden,
        message: `You do not have access to the org '${organization.name}'`,
      }));
    }

    next();
  } catch (e) {
    return sendError(res, e as Error);
  }
};
