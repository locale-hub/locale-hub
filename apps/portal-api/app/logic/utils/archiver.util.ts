import archiver from 'archiver';
import fs from 'fs';

/**
 * Util function to zip a local directory
 * @param {string} source The path to the folder to archive
 * @param {string} out The output path for the zip
 */
export const zipDirectory = async (
  source: string,
  out: string
): Promise<void> => {
  const archive = archiver('zip', {
    zlib: {
      level: 9,
    },
  });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', (err) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
};

export default {
  zipDirectory,
};
