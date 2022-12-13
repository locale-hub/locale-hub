import {Request, Response, Router as createRouter} from 'express';

import {getLocales} from '../logic/services/locale.service';
import {sendError} from '../logic/helpers/sendError.helper';

const router = createRouter({mergeParams: true});

/**
 * List of available locales
 */
router.get(
  '/',
  async function(req: Request, res: Response) {
    try {
      const locales = await getLocales();
      res.json({
        locales,
      });
    } catch (error) {
      sendError(res, error as Error);
    }
  });

export default router;
