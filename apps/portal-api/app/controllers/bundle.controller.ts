import { Request, Response, Router as createRouter } from 'express';

import { getBundle } from '../logic/services/bundle.service';
import { sendError } from '../logic/helpers/sendError.helper';
import { FileFormat } from '@locale-hub/data/enums/file-format.enum';

const router = createRouter({ mergeParams: true });

/**
 * Download the project bundle
 */
router.get('/', async function (req: Request, res: Response) {
  try {
    const projectId: string = req.params.projectId;
    const requestedFormat = req.query.format as string;
    const format: FileFormat = parseFileFormat(requestedFormat);
    const bundlePath = await getBundle(projectId, format);

    res.download(bundlePath);
  } catch (error) {
    sendError(res, error as Error);
  }
});

const parseFileFormat = (format: string): FileFormat => {
  switch (format) {
    case FileFormat.ANDROID:
      return FileFormat.ANDROID;
    case FileFormat.IOS:
      return FileFormat.IOS;
    default:
      throw new Error(`File format ${format} is not supported.`);
  }
};

export default router;
