import * as crypto from 'crypto';
import { ProjectRepository } from '@locale-hub/data/repositories/project.repository';
import { AppRepository } from '@locale-hub/data/repositories/app.repository';
import { App } from '@locale-hub/data/models/app.model';


const appRepository = new AppRepository();
const projectRepository = new ProjectRepository();

/**
 * List Apps for a given project
 * @param {string} projectId The project the apps should belongs to
 * @return {App[]} List of apps
 */
export const getAppsFromProject = async (projectId: string): Promise<App[]> => {
  return appRepository.findByProject(projectId);
};

/**
 * Create an App
 * @param {string} projectId A project Id
 * @param {string} appName The app name
 * @param {AppType} appType The type of app
 * @param {string} identifier The app source (eg: domain name, package name, ...)
 * @return {App|null} The newly created app, null if creation failed
 */
export const createApp = async (projectId: string, appName: string, appType: string, identifier: string)
  : Promise<App> => {
  await projectRepository.find(projectId);

  const key = crypto.randomBytes(64).toString('hex');

  return appRepository.insert(projectId, appName, key, appType, identifier);
};

/**
 * Delete an App
 * @param {string} projectId The Project that owns the app
 * @param {string} appId The App Id
 * @return {boolean} true if deleted, false otherwise
 */
export const deleteApp = async (projectId: string, appId: string): Promise<boolean> => {
  return await appRepository.delete(appId, projectId);
};
