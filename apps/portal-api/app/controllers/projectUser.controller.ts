import {Request, Response, Router as createRouter} from 'express';

import * as ProjectService from '../logic/services/project.service';
import {validateRequest} from '../logic/middlewares/validateRequest.middleware';
import {sendError} from '../logic/helpers/sendError.helper';
import { createProjectUserSchema } from '@locale-hub/data/requests/createProjectUser.request';

const router = createRouter({mergeParams: true});

/**
 * List project's users
 */
router.get(
  '/',
  async function(req: Request, res: Response) {
    try {
      const projectId: string = req.params.projectId;

      const users = (await ProjectService.getUserList(projectId))
        .map((user) => {
          // TODO: create response model
          // delete user.password;
          // delete user.passwordSalt;
          return user;
        });
      res.send({
        users,
      });
    } catch (error) {
      sendError(res, error as Error);
    }
  });

/**
 * Add a user from organization
 */
router.post(
  '/',
  validateRequest(createProjectUserSchema),
  async function(req: Request, res: Response) {
    try {
      const projectId: string = req.params.projectId;

      // TODO: should validate that user is part of organization
      const userId = req.body.userId;
      const role = req.body.role;

      await ProjectService.addUser(projectId, userId, role);
      res.status(204).send();
    } catch (error) {
      sendError(res, error as Error);
    }
  });

/**
 * Remove user from project
 */
router.delete(
  '/:userId',
  async function(req: Request, res: Response) {
    try {
      const projectId: string = req.params.projectId;
      const userId = req.params.userId;

      await ProjectService.revokeUser(projectId, req.user, userId);
      res.status(204).send();
    } catch (error) {
      sendError(res, error as Error);
    }
  });

export default router;
