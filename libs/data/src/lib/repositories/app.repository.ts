import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { dbDelete, dbInsert, dbMultiple, dbSingle } from './db.repository';
import { App } from '../models/app.model';
import { ApiException } from '../exceptions/api.exception';
import { ErrorCode } from '../enums/error-code.enum';

export class AppRepository {
  private readonly collectionName = 'apps';

  /**
   * Create a new application
   * @throws ApiException
   * @param {string} projectId the project the app belongs to
   * @param {string} name Name of the app
   * @param {string} key Key, will be used by
   * @param {AppType} type type of app
   * @param {string} identifier App identifier, like a package name or domain name
   * @return {App} the newly created App, null otherwise
   */
  insert = async (
    projectId: string,
    name: string,
    key: string,
    type: string,
    identifier: string
  ): Promise<App> => {
    const app = await dbInsert<App>(this.collectionName, {
      id: uuid(),
      projectId,
      name,
      key,
      type,
      identifier,
      createdAt: dayjs().utc().toISOString(),
    });

    if (null === app) {
      throw new ApiException({
        code: ErrorCode.appCannotCreate,
        message: 'Could not create App',
        statusCode: 500,
      });
    }

    return app;
  };

  /**
   * Find a app by its id
   * @throws ApiException
   * @param {string} appId Id of the app
   * @return {App} The app found, null otherwise
   */
  find = async (appId: string): Promise<App | null> => {
    const app = await dbSingle<App>(this.collectionName, { id: appId });

    if (null === app) {
      throw new ApiException({
        code: ErrorCode.appNotFound,
        message: 'Could not find App',
        statusCode: 404,
      });
    }

    return app;
  };

  /**
   * List apps of a given project
   * @throws ApiException
   * @param {string} projectId Id of the project
   * @return {App[]} List of project's app
   */
  findByProject = async (projectId: string): Promise<App[]> => {
    const apps = await dbMultiple<App>(this.collectionName, { projectId });

    if (null === apps) {
      throw new ApiException({
        code: ErrorCode.appNotFound,
        message: 'Could not find Apps',
        statusCode: 404,
      });
    }

    return apps;
  };

  /**
   * Delete a app by its id
   * @param {string} appId Id of the app
   * @param {string} projectId Id of the associated project
   * @return {boolean} true if app deleted, false otherwise
   */
  delete = async (appId: string, projectId: string): Promise<boolean> => {
    return await dbDelete<App>(this.collectionName, { id: appId, projectId });
  };
}
