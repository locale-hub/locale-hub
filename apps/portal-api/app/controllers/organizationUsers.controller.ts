import {Request, Response, Router as createRouter} from 'express';


import {validateRequest} from '../logic/middlewares/validateRequest.middleware';
import {getOrganizationUsers} from '../logic/services/organization.service';
import * as UserService from '../logic/services/user.service';
import * as MailService from '../logic/services/mail.service';
import {sendError} from '../logic/helpers/sendError.helper';
import crypto from 'crypto';
import argon2 from 'argon2';
import { UserGroupEntry } from '@locale-hub/data/models/user-group-entry.model';
import { UserRepository } from '@locale-hub/data/repositories/user.repository';
import { ProjectRepository } from '@locale-hub/data/repositories/project.repository';
import { NotificationRepository } from '@locale-hub/data/repositories/notification.repository';
import { inviteUserRequest } from '@locale-hub/data/requests/inviteUser.request';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { OrganizationRepository } from '@locale-hub/data/repositories/organization.repository';
import { ApiException } from '@locale-hub/data/exceptions/api.exception';
import { environment } from '../../environments/environment';
import { User } from '@locale-hub/data/models/user.model';

const router = createRouter({mergeParams: true});
const userRepository = new UserRepository();
const organizationRepository = new OrganizationRepository();
const projectRepository = new ProjectRepository();
const notificationRepository = new NotificationRepository();

const secret = Buffer.from(environment.security.password.secret, 'utf8');

/**
 * Get users of the given organization
 */
router.get('/', async function(req: Request, res: Response) {
  const users = (await getOrganizationUsers(req.params.organizationId))
    .map((user: User) => {
      // TODO: create response class
      // delete user.password;
      // delete user.passwordSalt;
      return user;
    });

  res.json({
    users,
  });
});

/**
 * Invite user to the organization
 */
router.post(
  '/invite',
  validateRequest(inviteUserRequest),
  async function(req: Request, res: Response) {
    try {
      const organizationId = req.params.organizationId;
      const inviteeName = req.body.name;
      const inviteeEmail = req.body.primaryEmail;

      // validate authenticated user is owner
      const organization = await organizationRepository.find(organizationId);
      if (organization.owner !== req.user.id) {
        return sendError(res, new ApiException({
          statusCode: 403,
          code: ErrorCode.organizationActionRequiresOwnerAccess,
          message: 'Only the organization owner can send invitations',
        }));
      }

      // user already in organization
      if (organization.users.includes(inviteeEmail)) {
        return sendError(res, new ApiException({
          statusCode: 400,
          code: ErrorCode.organizationUserAlreadyExists,
          message: 'The given email is already a part of the organization',
        }));
      }

      const userExists = await userEmailExists(inviteeEmail);
      if (!userExists) {
      // create user
        const rawPassword = Math.random().toString(36).slice(2);
        const salt = await crypto.randomBytes(environment.security.password.saltLength);
        const password = await argon2.hash(rawPassword, {
          type: argon2.argon2id,
          salt,
          secret,
        });
        await UserService.createUser(inviteeName, inviteeEmail, password, salt.toString());

        // send email
        const loginUrl = `${environment.portal.web.uri}${environment.portal.web.routes.login}`;
        MailService.send(inviteeEmail,
          `You have been invited to Locale Hub by ${organization.name} organization!`,
          'organizations.userInvite', {
            inviteeName: inviteeName,
            organizationName: organization.name,
            loginUrl: loginUrl,
            rawPassword: rawPassword,
          },
        );
      }

      organization.users.push(inviteeEmail);
      await organizationRepository.put(organization);

      const user = await userRepository.findByEmail(inviteeEmail);
      await notificationRepository.create(
        [user.id],
        'Organization invitation',
        `You have been invited to ${organization.name} organization. You should gain access to projects soon.`,
      );

      res.status(204).send();
    } catch (error) {
      sendError(res, error as Error);
    }
  });

/**
 * Remove user from the organization
 */
router.delete(
  '/:userId',
  async function(req: Request, res: Response) {
    try {
      const userIdToDelete = req.params.userId;

      // validate authenticated user is owner
      const organization = await organizationRepository.find(req.params.organizationId);
      if (organization.owner !== req.user.id) {
        return sendError(res, new ApiException({
          statusCode: 403,
          code: ErrorCode.organizationActionRequiresOwnerAccess,
          message: 'Only the owner can remove users',
        }));
      }

      // Owner cannot be removed
      if (userIdToDelete === req.user.id) {
        return sendError(res, new ApiException({
          statusCode: 403,
          code: ErrorCode.organizationUserCannotRemoveOwner,
          message: 'Organization owner cannot be removed',
        }));
      }

      // TODO: Remove user from organization, not userRepository
      await userRepository.delete(organization.id, userIdToDelete);

      const projects = await projectRepository.getFromOrganizations([organization.id]);
      for (const project of projects) {
        const users = project.users.filter((u: UserGroupEntry) => u.id !== userIdToDelete);
        if (users.length !== project.users.length) {
          project.users = users;
          await projectRepository.update(project.id, project);
        }
      }

      await notificationRepository.create(
        [userIdToDelete],
        'Organization removal',
        `You have been removed from organization ${organization.name}. ` +
        'You cannot access the projects from this organization anymore.',
      );

      res.status(204).send();
    } catch (error) {
      sendError(res, error as Error);
    }
  });


// ###
// private inner methods
// ###

const userEmailExists = async (inviteeEmail: string): Promise<boolean> => {
  try {
    await userRepository.findByEmail(inviteeEmail);
    return true;
  } catch (e) {
    return false;
  }
};

export default router;
