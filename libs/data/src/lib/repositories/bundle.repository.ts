import {dbAggregate} from './db.repository';
import {Commit} from '../models/commit.model';
import {Manifest} from '../models/manifest.model';
import {ApiException} from '../exceptions/api.exception';
import {ErrorCode} from '../enums/error-code.enum';

type ManifestContent = { [locale: string]: Manifest };

export class BundleRepository {
  /**
   * Return published ManifestEntries for a given project
   * @throws ApiException
   * @param {string} projectId Project Id to get the manifest from
   * @return {ManifestContent} The bundle content
   */
  getBundle = async (projectId: string): Promise<ManifestContent> => {
    const commits: Commit[] | null = await dbAggregate<Commit>('commits', [{
      $match: {
        projectId,
        deployed: true,
      },
    }]);

    if (null === commits) {
      throw new ApiException({
        code: ErrorCode.commitNotFound,
        message: 'Could not find Commits',
        statusCode: 404,
      });
    }

    if (0 === commits.length) {
      throw new ApiException({
        code: ErrorCode.commitNotFound,
        message: 'No published commits',
        statusCode: 400,
      });
    }

    const manifestLog = commits[commits.length - 1].changeList.manifest;

    for (const locale of Object.keys(manifestLog)) {
      for (const key of Object.keys(manifestLog[locale])) {
        manifestLog[locale][key] = this.applyNestedKeys(manifestLog[locale][key], manifestLog[locale]);
      }
    }

    return manifestLog;
  }


  private applyNestedKeys(value: string, manifest: Manifest) {
    const matches = [...value.matchAll(/{{\s*(\w|\.|-)+\s*}}/gi)];
    if (0 === matches.length) {
      return value;
    }

    for (const match of matches) {
      const nestedKey = match[0]
        .replace(/{{\s*/gi, '')
        .replace(/\s*}}/gi, '');

      const matchedEntry = manifest[nestedKey];
      const newValue = undefined !== matchedEntry ?
        // Apply sub-nested keys
        this.applyNestedKeys(matchedEntry, manifest) :
        '';

      value = value.replace(match[0], newValue);
    }

    return value;
  }
}
