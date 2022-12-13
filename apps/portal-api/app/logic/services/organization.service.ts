import {calculateObjectSize} from 'bson';


import {sdkRemoveProject} from './sdk.service';
import {deleteProject} from './project.service';
import { Project } from '@locale-hub/data/models/project.model';
import { ProjectRepository } from '@locale-hub/data/repositories/project.repository';
import { Organization } from '@locale-hub/data/models/organization.model';
import { OrganizationApiUsage, OrganizationStorageUsage } from '@locale-hub/data/models/usage.model';
import { NotificationRepository } from '@locale-hub/data/repositories/notification.repository';
import { OrganizationRepository } from '@locale-hub/data/repositories/organization.repository';
import { CommitRepository } from '@locale-hub/data/repositories/commit.repository';
import { User } from '@locale-hub/data/models/user.model';

const organizationRepository = new OrganizationRepository();
const projectRepository = new ProjectRepository();
const commitRepository = new CommitRepository();
const notificationRepository = new NotificationRepository();

/**
 * Get organization information
 * @param {string} organizationId An organization Id
 * @return {Organization|null} The organization found, null if no result
 */
export const getOrganization = async (organizationId: string): Promise<Organization> => {
  return await organizationRepository.find(organizationId);
};

/**
 * List organizations for a specific user
 * @param {User} user The user to get the organizations from
 * @return {Organization[]|null} A list of organizations
 */
export const getUsersOrganizations = async (user: User): Promise<Organization[]> => {
  return await organizationRepository.findOrganizationsByUser(user) ?? [];
};

/**
 * List users of an organization
 * @param {string} organizationId An organization id
 * @return {User[]|null} The list of organization's users, null if organization does not exists
 */
export const getOrganizationUsers = async (organizationId: string): Promise<User[]> => {
  return await organizationRepository.findUsers(organizationId);
};

/**
 * Edit an organization's information
 * @param {Organization} organization The updated content of the organization
 * @return {boolean} true if the changes as successful, false otherwise
 */
export const putOrganization = async (organization: Organization): Promise<boolean> => {
  return await organizationRepository.put(organization);
};

/**
 * List projects of an organization
 * @param {string[]} organizationIds An organization id list
 * @return {Project[]} The list of organization's projects
 */
export const getOrganizationProjects = async (organizationIds: string[]): Promise<Project[]> => {
  return await projectRepository.getFromOrganizations(organizationIds);
};

/**
 * Get the plan storage usage of an organization
 * @param {string} organizationId An organization id
 * @return {OrganizationStorageUsage|null} The organization's usage, null if organization does not exists
 */
export const getOrganizationStorageUsage = async (organizationId: string): Promise<OrganizationStorageUsage> => {
  const organization = await organizationRepository.find(organizationId);

  const orgMaxSize = 1;
  const projectMaxSize = 1;

  const usageData: OrganizationStorageUsage = {
    name: organization.name,
    size: 200,
    max: orgMaxSize * 1000,
    projects: [],
  };

  const projects = await projectRepository.getFromOrganizations([organizationId]);
  for (const project of projects) {
    const commits = await commitRepository.findByProject(project.id);
    const size = calculateObjectSize(commits) / 1000;

    usageData.projects.push({
      name: project.name,
      size: size,
      max: projectMaxSize * 1000,
    });

    usageData.size += size;
  }

  return usageData;
};

/**
 * Get the plan SDK API usage of an organization
 * @param {string} _organizationId An organization id
 * @return {OrganizationStorageUsage|null} The organization's usage, null if organization does not exists
 */
export const getOrganizationApiUsage = async (_organizationId: string): Promise<OrganizationApiUsage> => {
  // const organization = await organizationRepository.find(organizationId);

  return {
    price: 0,
    quantity: 1,
    nextInvoiceDate: Date.now(),
  };
};

export const deleteOrganization = async (organizationId: string): Promise<boolean> => {
  const organization = await getOrganization(organizationId);
  const users = await getOrganizationUsers(organizationId);

  const isDeleted = await organizationRepository.delete(organizationId);

  const projects = await getOrganizationProjects([organizationId]);
  for (const project of projects) {
    await deleteProject(project.id);
    await sdkRemoveProject(project.id);
  }

  await notificationRepository.create(
    users.map((user) => user.id),
    'Organization deleted!',
    `${organization.name} has been deleted.`,
  );

  return isDeleted;
};
