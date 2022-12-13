import {dbAggregate, dbSingle} from './db.repository';
import {Commit} from '../models/commit.model';
import {CommitRepository} from './commit.repository';
import {ChangeList} from '../models/change-list.model';
import {Manifest} from '../models/manifest.model';
import {ApiException} from '../exceptions/api.exception';
import {ErrorCode} from '../enums/error-code.enum';

const commitRepository = new CommitRepository();

/**
 * List of commits dates for a given project
 * @throws ApiException
 * @param {string} projectId Project Id to search commits dates in
 * @return {string[]} The list of dates a commit has been made
 */
const getPublishedCommitDates = async (projectId: string): Promise<string[]> => {
  const commits = await commitRepository.findByProject(projectId);

  if (0 === commits.filter((c) => c.deployed).length) {
    return [];
  }

  const deployedCommits: Commit[] = [];
  for (const commit of commits) {
    deployedCommits.push(commit);
    if (commit.deployed) {
      return deployedCommits.map((commit: Commit) => commit.createdAt);
    }
  }
  return deployedCommits.map((commit: Commit) => commit.createdAt);
};

export class ManifestRepository {
  /**
   * Return latest ChangeList for a given project
   * @throws ApiException
   * @param {string} projectId Project Id to get the manifest from
   * @return {ManifestEntry[]} The list latest manifest values
   */
  get = async (projectId: string): Promise<ChangeList> => {
    const commits = await dbAggregate<Commit>('commits', [{
      $match: {
        projectId: projectId,
      },
    }]);

    if (null === commits) {
      throw new ApiException({
        code: ErrorCode.commitNotFound,
        message: 'Could not find commits',
        statusCode: 404,
      });
    }

    return commits.length > 0 ?
      commits[commits.length - 1].changeList :
      {locales: [], keys: [], manifest: {}};
  }

  /**
   * Return published ManifestEntries for a given project
   * @throws ApiException
   * @param {string} projectId Project Id to get the manifest from
   * @return {ChangeList} The list published manifest values
   */
  getPublished = async (projectId: string): Promise<ChangeList | null> => {
    const publishedCommitDates = await getPublishedCommitDates(projectId);

    if (0 === publishedCommitDates.length) {
      return null;
    }

    const commits = await dbAggregate<Commit>('commits', [{
      $match: {
        projectId: projectId,
        deployed: true,
      },
    }]);

    if (null === commits) {
      throw new ApiException({
        code: ErrorCode.commitNotFound,
        message: 'Could not find commits',
        statusCode: 404,
      });
    }

    return commits.length > 0 ?
      commits[commits.length - 1].changeList :
      {locales: [], keys: [], manifest: {}};
  }

  /**
   * Return latest ManifestEntries for a given project and locale
   * @throws ApiException
   * @param {string} projectId Project Id to get the manifest from
   * @param {string} locale Locale tag
   * @return {Manifest} The list latest manifest values for a given locale
   */
  getLocale = async (projectId: string, locale: string): Promise<Manifest | null> => {
    const commits = await dbAggregate<Commit>('commits', [{
      $match: {
        projectId: projectId,
      },
    }]);

    if (null === commits) {
      throw new ApiException({
        code: ErrorCode.commitNotFound,
        message: 'Could not find commits',
        statusCode: 404,
      });
    }

    if (0 === commits.length) {
      return null;
    }

    const changeList = commits[commits.length - 1].changeList;

    if (!changeList.locales.includes(locale)) {
      return null;
    }

    return changeList.manifest[locale];
  }

  /**
   * Return ManifestEntries for a given commit
   * @throws ApiException
   * @param {string} projectId Project Id to get the manifest from
   * @param {string} commitId Project Id to get the manifest from
   * @return {ChangeList} The list of manifest values for the given commit
   */
  getCommit = async (projectId: string, commitId: string): Promise<ChangeList | null> => {
    const commit = await dbSingle<Commit>('commits', [{
      $match: {
        projectId: projectId,
        id: commitId,
      },
    }]);

    if (null === commit) {
      throw new ApiException({
        code: ErrorCode.commitNotFound,
        message: 'Could not find commit',
        statusCode: 404,
      });
    }

    return commit.changeList;
  }
}
