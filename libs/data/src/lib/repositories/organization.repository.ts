import {dbDelete, dbInsert, dbMultiple, dbSingle, dbUpdate} from './db.repository';
import {Organization} from '../models/organization.model';
import {User} from '../models/user.model';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)
import {ApiException} from '../exceptions/api.exception';
import {ErrorCode} from '../enums/error-code.enum';
import {NotificationRepository} from './notification.repository';
import {UserRoles} from '../enums/user-roles.enum';

const notificationRepository = new NotificationRepository();

export class OrganizationRepository {
  private readonly collectionName = 'organizations';

  /**
   * Create a new Organization
   * @throws ApiException
   * @param {string} id Organization Id
   * @param {string} ownerUserId Owner of the organization
   * @param {string} name Organization name
   * @return {Organization} the newly created organization, null otherwise
   */
  insert = async (id: string, ownerUserId: string, name: string): Promise<Organization> => {
    const user = await dbSingle<User>('users', {id: ownerUserId});

    if (null === user) {
      throw new ApiException({
        code: ErrorCode.userNotFound,
        message: 'Could not find user',
        statusCode: 404,
      });
    }

    const organization = await dbInsert<Organization>(this.collectionName, {
      id,
      name,
      owner: ownerUserId,
      users: [user.primaryEmail],
      createdAt: dayjs().utc().toString(),
    });

    if (null === organization) {
      throw new ApiException({
        code: ErrorCode.serverError,
        message: 'Could not create organization',
        statusCode: 500,
      });
    }

    await notificationRepository.create(
      [user.id],
      'Organization created!',
      `Welcome to ${organization.name}!<br />` +
      'You can invite users in your organization. They will be able to view projects, translate your app ' +
      'and integrate those in your applications.',
      `/organizations/${organization.id}/users`,
    );

    return organization;
  }

  /**
   * Find an organization by its id
   * @throws ApiException
   * @param {string} id Id of the organization
   * @return {Organization} The organization found, null otherwise
   */
  find = async (id: string): Promise<Organization> => {
    const organization = await dbSingle<Organization>(this.collectionName, {id});

    if (null === organization) {
      throw new ApiException({
        code: ErrorCode.organizationNotFound,
        message: 'Could not find organization',
        statusCode: 404,
      });
    }

    return organization;
  }

  /**
   * List of organization's users
   * @throws ApiException
   * @param {string} organizationId Organization Id
   * @return {User[]} The list users found, empty array if no result found
   */
  findUsers = async (organizationId: string): Promise<User[]> => {
    const organization = await dbSingle<Organization>(this.collectionName, {id: organizationId});

    if (null === organization) {
      throw new ApiException({
        code: ErrorCode.organizationNotFound,
        message: 'Could not find organization',
        statusCode: 404,
      });
    }

    const users = await dbMultiple<User>('users', {
      'emails.email': {
        $in: organization.users,
      },
    });

    if (null === users) {
      throw new ApiException({
        code: ErrorCode.userNotFound,
        message: 'Could not find users',
        statusCode: 404,
      });
    }

    return users
      .map((user) => {
        user.role = (organization.owner === user.id) ? UserRoles.OWNER : UserRoles.USER;
        return user;
      });
  }

  /**
   * Update organization's information
   * @param {Organization} organization The updated organization
   * @return {boolean} true if deleted successfully, false otherwise
   */
  put = async (organization: Organization): Promise<boolean> => {
    return await dbUpdate<Organization>(this.collectionName, {id: organization.id}, {$set: {
      name: organization.name,
      owner: organization.owner,
      users: organization.users,
    }});
  }

  delete = async (organizationId: string): Promise<boolean> => {
    return await dbDelete<Organization>(this.collectionName, {id: organizationId});
  }

  /**
   * @throws ApiException
   * @param {User} user The user to get the organizations from
   * @return {Organization} return the list of organizations
   */
  findOrganizationsByUser = async (user: User): Promise<Organization[]> => {
    const organizations = await dbMultiple<Organization>(this.collectionName, {
      users: {
        $elemMatch: {
          $in: user.emails.map((e) => e.email),
        },
      },
    });

    if (null === organizations) {
      throw new ApiException({
        code: ErrorCode.organizationNotFound,
        message: 'Could not find organizations',
        statusCode: 404,
      });
    }

    return organizations;
  }
}
