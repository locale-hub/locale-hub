import {dbDelete, dbInsert, dbMultiple, dbSingle, dbUpdate} from './db.repository';
import {User} from '../models/user.model';
import {v4 as uuid} from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)
import {EmailStatus} from '../enums/email-status.enum';
import {ApiException} from '../exceptions/api.exception';
import {ErrorCode} from '../enums/error-code.enum';

export class UserRepository {
  private readonly collectionName = 'users';

  /**
   * Create a new user
   * @throws ApiException
   * @param {string} name User name
   * @param {string} email User email
   * @param {string} password User encrypted password
   * @param {string} passwordSalt User password salt
   * @return {User} the newly created user, null otherwise
   */
  insert = async (name: string, email: string, password: string, passwordSalt: string): Promise<User> => {
    const user = await dbInsert<User>(this.collectionName, {
      id: uuid(),
      name,
      primaryEmail: email,
      emails: [{
        email,
        status: EmailStatus.PRIMARY,
        createdAt: dayjs().utc().toString(),
      }],
      password,
      passwordSalt,
      createdAt: dayjs().utc().toString(),
    });

    if (null === user) {
      throw new ApiException({
        code: ErrorCode.serverError,
        message: 'Could not create user',
        statusCode: 500,
      });
    }

    return user;
  }

  /**
   * Find an user by its id
   * @throws ApiException
   * @param {string} userId Id of the user
   * @return {User} The user found, null otherwise
   */
  find = async (userId: string): Promise<User> => {
    const user = await dbSingle<User>(this.collectionName, {id: userId});

    if (null === user) {
      throw new ApiException({
        code: ErrorCode.userNotFound,
        message: 'Could not find user',
        statusCode: 404,
      });
    }

    return user;
  }

  /**
   * Find an user by its email
   * @throws ApiException
   * @param {string} email Email of the user
   * @return {User} The user found, null otherwise
   */
  findByEmail = async (email: string): Promise<User> => {
    const user = await dbSingle<User>(this.collectionName, {'emails.email': email});

    if (null === user) {
      throw new ApiException({
        code: ErrorCode.userNotFound,
        message: 'Could not find user',
        statusCode: 404,
      });
    }

    return user;
  }

  /**
   * Validate that an email exists
   * @param {string} email Email of the user
   * @return {boolean} true if found, false otherwise
   */
  emailExists = async (email: string): Promise<boolean> => {
    const user = await dbSingle<User>(this.collectionName, {'emails.email': email});

    return null !== user;
  }

  /**
   * Find a list of users from a set of ids
   * @throws ApiException
   * @param {string[]} userIds List of ids to look for
   * @return {User[]} The list users found, empty array if no result found
   */
  findIn = async (userIds: string[]): Promise<User[]> => {
    const users = await dbMultiple<User>(this.collectionName, {id: {$in: userIds}});

    if (null === users) {
      throw new ApiException({
        code: ErrorCode.userNotFound,
        message: 'Could not find users',
        statusCode: 404,
      });
    }

    return users;
  }

  /**
   * Update a user
   * @param {string} userId Id of the user
   * @param {User} user Updated information of the user
   * @return {User} The updated user, null if edit failed
   */
  update = async (userId: string, user: User): Promise<User> => {
    await dbUpdate<User>(this.collectionName, {id: userId}, {$set: {
      primaryEmail: user.primaryEmail,
      emails: user.emails,
      name: user.name,
      password: user.password,
    }});

    return await this.find(userId);
  }

  /**
   * Update a user
   * @param {string} userId Id of the user
   * @param {string} password The new password
   * @return {boolean} true if updated successfully, false otherwise
   */
  updatePassword = async (userId: string, password: string): Promise<boolean> => {
    return await dbUpdate<User>(this.collectionName, {id: userId}, {$set: {
      password,
    }});
  }

  /**
   * Remove an user from organization
   * @param {string} organizationId Organization Id to remove the user from
   * @param {string} userId User id to delete
   * @return {boolean} true if deleted successfully, false otherwise
   */
  delete = async (organizationId: string, userId: string): Promise<boolean> => {
    // TODO: organizationId does not exists anymore
    return await dbDelete<User>(this.collectionName, {
      id: userId,
      organizationId,
    });
  }
}
