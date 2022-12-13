import {Request, Response, Router as createRouter} from 'express';

import {sendError} from '../logic/helpers/sendError.helper';
import { UserRepository } from '@locale-hub/data/repositories/user.repository';


const router = createRouter({mergeParams: true});
const userRepository = new UserRepository();

/**
 * Edit current users information
 */
router.get(
  '/:userId', async function(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const user = await userRepository.find(userId);

      // TODO: create mapping
      // delete user.emails;
      // delete user.passwordSalt;
      // delete user.password;

      res.json({
        user,
      });
    } catch (error) {
      sendError(res, error as Error);
    }
  });


export default router;
