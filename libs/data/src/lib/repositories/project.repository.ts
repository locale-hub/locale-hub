import {
  dbAggregate,
  dbDelete,
  dbInsert,
  dbMultiple,
  dbSingle,
  dbUpdate,
} from './db.repository';
import { Project } from '../models/project.model';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { App } from '../models/app.model';
import { Commit } from '../models/commit.model';
import { User } from '../models/user.model';
import { UserRoles } from '../enums/user-roles.enum';
import { ApiException } from '../exceptions/api.exception';
import { ErrorCode } from '../enums/error-code.enum';

export class ProjectRepository {
  private readonly collectionName = 'projects';

  /**
   * Create a new Project
   * @throws ApiException
   * @param {string} name Project name
   * @param {string} organizationId The organization the project belongs to
   * @param {User} user Owner of the project
   * @param {string} defaultLocale Default locale tag of the project
   * @return {Project} the newly created project, null otherwise
   */
  insert = async (
    name: string,
    organizationId: string,
    user: User,
    defaultLocale: string
  ): Promise<Project> => {
    const project = await dbInsert<Project>(this.collectionName, {
      id: uuid(),
      name,
      organizationId,
      userId: user.id,
      defaultLocale,
      archived: false,
      userGroups: [],
      users: [
        {
          id: user.id,
          role: UserRoles.OWNER,
        },
      ],
      createdAt: dayjs().utc().toString(),
    });

    if (null === project) {
      throw new ApiException({
        code: ErrorCode.serverError,
        message: 'Could not create project',
        statusCode: 500,
      });
    }

    return project;
  };

  /**
   * Find an project by its id
   * @throws ApiException
   * @param {string} projectId Id of the project
   * @return {Project} The project found, null otherwise
   */
  find = async (projectId: string): Promise<Project> => {
    const project = await dbSingle<Project>(this.collectionName, {
      id: projectId,
    });

    if (null === project) {
      throw new ApiException({
        code: ErrorCode.projectNotFound,
        message: 'Could not find project',
        statusCode: 404,
      });
    }

    return project;
  };

  /**
   * List of organization's projects
   * @throws ApiException
   * @param {string[]} organizationIds Organization Id list
   * @return {Project[]} The list projects found, empty array if no result found
   */
  getFromOrganizations = async (
    organizationIds: string[]
  ): Promise<Project[]> => {
    const projects = await dbMultiple<Project>(this.collectionName, {
      organizationId: {
        $in: organizationIds,
      },
    });

    if (null === projects) {
      throw new ApiException({
        code: ErrorCode.projectNotFound,
        message: 'Could not find projects',
        statusCode: 404,
      });
    }

    return projects;
  };

  /**
   * Update a project
   * @param {string} projectId Id of the project
   * @param {Project} project Updated information of the project
   * @return {boolean} true if updated successfully, false otherwise
   */
  update = async (projectId: string, project: Project): Promise<boolean> => {
    return await dbUpdate<Project>(
      this.collectionName,
      { id: projectId },
      { $set: project }
    );
  };

  /**
   * Remove Project
   * @throws ApiException
   * @param {string} projectId Project Id to remove
   * @return {boolean} true if deleted successfully, false otherwise
   */
  delete = async (projectId: string): Promise<boolean> => {
    await dbDelete<App>('apps', { projectId });
    await dbDelete<Commit>('commits', { projectId });
    return await dbDelete<Project>(this.collectionName, { id: projectId });
  };

  /**
   * Get translation progress for a given project
   * @throws ApiException
   * @param {string} projectId Project Id
   * @return {number} translation progress if the given project
   */
  getTranslationProgress = async (projectId: string): Promise<number> => {
    const commits: Commit[] | null = await dbAggregate<Commit>('commits', [
      {
        $match: {
          projectId,
        },
      },
    ]);

    if (null === commits) {
      throw new ApiException({
        code: ErrorCode.commitNotFound,
        message: 'Could not find Commits',
        statusCode: 404,
      });
    }

    const latestCommit = commits[commits.length - 1] ?? {
      changeList: {
        locales: [],
        keys: [],
        manifest: {},
      },
    };

    const latestChanges = latestCommit.changeList;

    const total = latestChanges.keys.length * latestChanges.locales.length;
    let translatedCount = 0;

    const manifest = latestChanges.manifest;
    for (const locale of Object.values(latestChanges.locales)) {
      if (undefined === manifest[locale]) {
        continue;
      }
      for (const key of Object.values(latestChanges.keys)) {
        const entry = manifest[locale][key];
        if (
          undefined === entry ||
          null === entry ||
          0 === entry.trim().length
        ) {
          continue;
        }
        translatedCount++;
      }
    }

    return translatedCount / total;
  };
}
