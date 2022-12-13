import {dbInsert, dbMultiple, dbSingle, dbUpdate} from './db.repository';
import {Commit} from '../models/commit.model';
import {v4 as uuid} from 'uuid';
import {ChangeList} from '../models/change-list.model';
import {ApiException} from '../exceptions/api.exception';
import {ErrorCode} from '../enums/error-code.enum';

export class CommitRepository {
  private readonly collectionName = 'commits';

  /**
   * Create a new Commit
   * @throws ApiException
   * @param {string} projectId the project the commit belongs to
   * @param {string} authorId Owner of the commit
   * @param {string} title Title of the commit
   * @param {string} description Detailed description
   * @param {ChangeList} changeList List of changes
   * @param {string} createdAt Date of creation of the commit
   * @return {Commit} the newly created commit, null otherwise
   */
  insert = async (projectId: string, authorId: string, title: string, description: string, changeList: ChangeList,
    createdAt: string): Promise<Commit> => {
    const commit = await dbInsert<Commit>(this.collectionName, {
      id: uuid(),
      projectId,
      authorId,
      title,
      description,
      changeList,
      deployed: false,
      createdAt,
    });

    if (null === commit) {
      throw new ApiException({
        code: ErrorCode.serverError,
        message: 'Could not create Commit',
        statusCode: 500,
      });
    }

    return commit;
  }

  /**
   * Find a commit by its id
   * @throws ApiException
   * @param {string} commitId Id of the commit
   * @return {Commit} The commit found, null otherwise
   */
  find = async (commitId: string): Promise<Commit> => {
    const commit = await dbSingle<Commit>(this.collectionName, {id: commitId});

    if (null === commit) {
      throw new ApiException({
        code: ErrorCode.commitNotFound,
        message: 'Could not find Commit',
        statusCode: 404,
      });
    }

    return commit;
  }

  /**
   * List commits of a given project
   * @throws ApiException
   * @param {string} projectId Id of the project
   * @return {Commit[]} List of project's commits
   */
  findByProject = async (projectId: string): Promise<Commit[]> => {
    const commits = await dbMultiple<Commit>(this.collectionName, {projectId});

    if (null === commits) {
      throw new ApiException({
        code: ErrorCode.commitNotFound,
        message: 'Could not find Commits',
        statusCode: 404,
      });
    }

    return commits;
  }

  /**
   * Update the `deployed` status of a given commit
   * @param {string} commitId The commit id to update
   * @param {boolean} deployed The new status of the commit
   * @return {boolean} true if updated successfully, false otherwise
   */
  setPublishState = async (commitId: string, deployed: boolean): Promise<boolean> => {
    return await dbUpdate<Commit>(this.collectionName, {id: commitId}, {$set: {
      deployed,
    }});
  }
}
