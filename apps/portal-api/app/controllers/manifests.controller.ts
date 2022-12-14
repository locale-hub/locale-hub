import { Request, Response, Router as createRouter } from 'express';

import {
  getKeyHistoryFromProject,
  getManifestFromProject,
} from '../logic/services/manifest.service';
import { sendError } from '../logic/helpers/sendError.helper';

const router = createRouter({ mergeParams: true });

/**
 * Get project's manifest
 */
router.get('/', async function (req: Request, res: Response) {
  try {
    const projectId = req.params.projectId;
    const manifest = await getManifestFromProject(projectId);

    res.json({
      manifest,
    });
  } catch (error) {
    sendError(res, error as Error);
  }
});

/**
 * TODO: This endpoint concerns the translation history, not the manifest
 * Get history of the given key-locale combination
 */
router.get('/history', async function (req: Request, res: Response) {
  try {
    const projectId = req.params.projectId;
    const key = req.query.key as string;
    const locale = req.query.locale as string;

    const history = await getKeyHistoryFromProject(projectId, key, locale);

    res.json({
      history,
    });
  } catch (error) {
    sendError(res, error as Error);
  }
});

export default router;
