import * as MailService from './mail.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)
import {generateEmailConfirmationToken} from '../middlewares/auth.middleware';
import {jwtService} from './jwt.service';
import { Email } from '@locale-hub/data/models/email.model';
import { UserRepository } from '@locale-hub/data/repositories/user.repository';
import { EmailStatus } from '@locale-hub/data/enums/email-status.enum';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';
import { UserInvitation } from '@locale-hub/data/models/user-invitation.model';
import { ApiException } from '@locale-hub/data/exceptions/api.exception';
import { User } from '@locale-hub/data/models/user.model';
import { environment } from '../../../environments/environment';

const userRepository = new UserRepository();

/**
 * Create a new user
 * @param {string} name Name of the user
 * @param {string} email Email of the user
 * @param {string} password Encrypted password of the user
 * @param {string} salt Password salt
 * @return {User|null} The newly created user, null if not created
 */
export const createUser = async (name :string, email: string, password: string, salt: string): Promise<User> => {
  return await userRepository.insert(name, email, password, salt);
};

/**
 * Find a list of users
 * @param {string[]} ids List of user Ids to find
 * @return {User[]} List of found users, non existing users are omitted
 */
export const findIn = async (ids: string[]): Promise<User[]> => {
  return await userRepository.findIn(ids);
};

export const updateUser = async (current: User, updated: User): Promise<User> => {
  const user = await userRepository.findByEmail(current.primaryEmail);

  const newEmails = updated.emails
    .filter((data) => EmailStatus.PENDING === data.status)
    .map((data) => {
      data.createdAt = dayjs().utc().toString();
      return data;
    });

  for (const {email} of newEmails) {
    if (await userRepository.emailExists(email)) {
      throw new ApiException({
        message: `Email '${email}' already exists.`,
        code: ErrorCode.userEmailAlreadyExists,
        statusCode: 403,
      });
    }
  }

  user.name = updated.name;
  user.primaryEmail = updated.primaryEmail;
  user.emails = updated.emails;

  for (const mail of newEmails) {
    const token = await generateEmailConfirmationToken({
      email: mail.email,
      createdAt: mail.createdAt,
    });
    const link = `${environment.portal.web.uri}/validate-email/${token}`;
    MailService.send(
      mail.email,
      'Confirm your email',
      'auth.email-confirmation',
      {
        userName: user.name,
        link,
      },
    );
  }

  return await userRepository.update(current.id, user);
};

export const validateNewUserEmail = async (current: User, body: { token: string }): Promise<User> => {
  const user = await userRepository.findByEmail(current.primaryEmail);

  const invitation = (await jwtService.read<any>(body.token)).invitation as UserInvitation;

  const hasEmail = user.emails
    .some((e: Email) => e.email === invitation.email);
  const isExpired = dayjs(invitation.createdAt)
    .add(15, 'minutes')
    .isBefore(dayjs().utc());

  if (!hasEmail) {
    throw new ApiException({
      message: 'The invitation is not linked to your account',
      code: ErrorCode.userInvitationInvalidAccount,
      statusCode: 403,
    });
  } else if (isExpired) {
    throw new ApiException({
      message: 'Invitation expired, please try again',
      code: ErrorCode.userInvitationExpired,
      statusCode: 410,
    });
  }

  user.emails = user.emails.map((e: Email) => {
    if (e.email === invitation.email) {
      e.status = EmailStatus.VALID;
    }
    return e;
  });

  return await userRepository.update(current.id, user);
};
