import { NextFunction, Request, Response } from 'express';
import * as ProjectService from '../services/project.service';
import * as OrganizationService from '../services/organization.service';
import { sendError } from '../helpers/sendError.helper';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { ApiException } from '@locale-hub/data/exceptions/api.exception';
import { User } from '@locale-hub/data/models/user.model';

/**
 * Validate that the authenticated user has access to project
 * Requires req.user to be set (authenticate middleware)
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @param {NextFunction} next Express NextFunction
 */
export const validateUserAccessToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: User = req.user;

    const projectId: string = req.params.projectId;
    if (undefined === projectId || null === projectId) {
      return sendError(
        res,
        new ApiException({
          statusCode: 400,
          code: ErrorCode.requestInvalid,
          message: 'ProjectId not found in url',
        })
      );
    }

    const project = await ProjectService.getProject(projectId);
    if (null === project) {
      return sendError(
        res,
        new ApiException({
          statusCode: 404,
          code: ErrorCode.projectNotFound,
          message: 'Project cannot be found',
        })
      );
    }

    const projectHasUser = project.users.some((entry) => {
      return entry.id === user.id;
    });

    if (projectHasUser) {
      return next();
    }

    const organization = await OrganizationService.getOrganization(
      project.organizationId
    );
    if (null !== organization && organization.owner === user.id) {
      return next();
    }

    return sendError(
      res,
      new ApiException({
        statusCode: 403,
        code: ErrorCode.userAccessForbidden,
        message: `You do not have access to the project '${project.name}'`,
      })
    );
  } catch (e) {
    return sendError(res, e as Error);
  }
};
