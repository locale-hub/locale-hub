import { Project } from '@locale-hub/data/models/project.model';
import {ProjectRepository} from '@locale-hub/data/repositories/project.repository';
import {LocaleRepository} from '@locale-hub/data/repositories/locale.repository';
import {UserRoles} from '@locale-hub/data/enums/user-roles.enum';
import {User} from '@locale-hub/data/models/user.model';
import {UserRepository} from '@locale-hub/data/repositories/user.repository';
import {ProjectTranslationProgress} from '@locale-hub/data/models/project-translation-progress.model';
import {NotificationRepository} from '@locale-hub/data/repositories/notification.repository';

const projectRepository = new ProjectRepository();
const localeRepository = new LocaleRepository();
const userRepository = new UserRepository();
const notificationRepository = new NotificationRepository();

/**
 * Create a new project
 * @param {string} name Project Name
 * @param {string} organizationId The organization owning the project
 * @param {User} owner The project owner
 * @param {string} defaultLocale The default project locale
 * @return {Project|null} The newly created project, null in case of failure
 */
export const createProject = async (name: string, organizationId: string, owner: User,
  defaultLocale: string): Promise<Project | null> => {
  const locale = await localeRepository.find(defaultLocale);
  const localeTag: string = null !== locale ? locale.tag : 'en';

  const project = await projectRepository.insert(name, organizationId, owner, localeTag);

  await notificationRepository.create(
    [owner.id],
    'Project created!',
    `Project ${name} has been created. You can now start translating your apps.`,
    `/projects/${project.id}/overview`,
  );

  return project;
};

/**
 * Get project's information
 * @param {string} projectId A project Id
 * @return {Project|null} The project found, null otherwise
 */
export const getProject = async (projectId: string): Promise<Project> => {
  return await projectRepository.find(projectId);
};

/**
 * Update a project's information
 * @param {string} projectId A project Id
 * @param {Project} project The updated information about the project
 * @return {boolean} true if updated successfully, false otherwise
 */
export const updateProject = async (projectId: string, project: Project): Promise<boolean> => {
  return await projectRepository.update(projectId, project);
};

/**
 * Delete a given project
 * @param {string} projectId A project Id
 * @return {boolean} true if deleted, false otherwise
 */
export const deleteProject = async (projectId: string): Promise<boolean> => {
  const project = await projectRepository.find(projectId);
  const isDeleted = await projectRepository.delete(projectId);

  await notificationRepository.create(
    project.users.map((u) => u.id),
    'Project deleted',
    `Project ${project.name} has been delete.`,
  );

  return isDeleted;
};

/**
 * Get projects translation progress
 * @param {string[]} projectIds List to get translation progress
 * @return {ProjectTranslationProgress} The projects progress
 */
export const getProjectsTranslationProgress = async (projectIds: string[]): Promise<ProjectTranslationProgress[]> => {
  return await Promise.all(projectIds.map(async (projectId) => {
    const progress = await projectRepository.getTranslationProgress(projectId);

    return {
      projectId,
      progress,
    };
  }));
};

/**
 * List users of a project
 * @param {string} projectId A project Id
 * @return {User[]|null} List of project's users, null if no project found
 */
export const getUserList = async (projectId: string): Promise<User[]> => {
  const project = await projectRepository.find(projectId);

  const userIds = project.users.map((entry) => entry.id);
  const users = await userRepository.findIn(userIds);

  return users.map((user) => {
    user.role = project.users
      .filter((entry) => entry.id === user.id)
      .map((entry) => entry.role)[0];

    user.password = '';

    return user;
  });
};

/**
 * Add a user to a given project
 * @param {string} projectId A project Id
 * @param {string} userId The user Id to add
 * @param {UserRoles} role The role of the user in the given project
 * @return {boolean} true if added properly, false otherwise
 */
export const addUser = async (projectId: string, userId: string, role: UserRoles): Promise<boolean> => {
  const project = await projectRepository.find(projectId);

  if (null === project) {
    return false;
  }

  const userExists = project.users.filter((entry) => entry.id === userId);
  if (0 !== userExists.length) {
    const index = project.users.indexOf(userExists[0]);
    project.users[index].role = role;
  } else {
    project.users.push({
      id: userId,
      role,
    });
  }

  await notificationRepository.create(
    [userId],
    'Project invitation',
    `You have been invited to ${project.name}.`,
  );

  return await updateProject(projectId, project);
};

/**
 * Remove a user to a given project
 * @param {string} projectId A project Id
 * @param {string} authenticatedUserId The user Id performing the operation
 * @param {string} userId The user Id to remove
 * @return {boolean} true if removed properly, false otherwise
 */
export const revokeUser = async (projectId: string, authenticatedUserId: string, userId: string): Promise<boolean> => {
  const project = await projectRepository.find(projectId);

  if (null === project) {
    return false;
  }

  const authenticatedUserExists = project.users.filter((entry) => entry.id === authenticatedUserId);
  if (0 !== authenticatedUserExists.length) {
    const index = project.users.indexOf(authenticatedUserExists[0]);

    if (UserRoles.ADMIN !== project.users[index].role) {
      return false;
    }
  }

  project.users = project.users.filter((entry) => entry.id !== userId);

  await notificationRepository.create(
    [userId],
    'Project removal',
    `You have been removed to ${project.name}.`,
  );

  return await updateProject(projectId, project);
};
