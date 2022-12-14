import { dbInsert, dbMultiple, dbSingle, dbUpdate } from './db.repository';
import { Notification } from '../models/notification.model';
import { ApiException } from '../exceptions/api.exception';
import { ErrorCode } from '../enums/error-code.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export class NotificationRepository {
  private readonly collectionName = 'notifications';

  /**
   * Create a notification to a given list of users
   *
   * @param {string[]} userIds List of users targeted
   * @param {string} title Title
   * @param {string} text Optional description
   * @param {string} link Optional portal web url
   * @param {string} img An optional image link to display
   */
  create = async (
    userIds: string[],
    title: string,
    text?: string,
    link?: string,
    img?: string
  ): Promise<Notification> => {
    const users = userIds.map((userId) => {
      return {
        id: userId,
        status: NotificationStatus.UNREAD,
      };
    });

    const notification = await dbInsert<Notification>(this.collectionName, {
      id: uuid(),
      title,
      text,
      link,
      img,
      users,
      createdAt: dayjs().utc().toString(),
    });

    if (null === notification) {
      throw new ApiException({
        code: ErrorCode.notificationCannotCreate,
        message: 'Cannot create notification',
        statusCode: 500,
      });
    }

    return notification;
  };

  /**
   * List of user's notification
   * @throws ApiException
   * @param {string} userId A user id
   * @param {NotificationStatus} status The status used to filter notifications
   * @return {Notification[]} The list notifications
   */
  getForUser = async (
    userId: string,
    status: NotificationStatus
  ): Promise<Notification[]> => {
    const notifications = await dbMultiple<Notification>(this.collectionName, {
      users: {
        id: userId,
        status: status,
      },
    });

    return notifications ?? [];
  };

  /**
   * Remove Project
   * @throws ApiException
   * @param {string} notificationId Notification to discard
   * @param {string} userId A User id
   * @return {boolean} true if deleted successfully, false otherwise
   */
  discardForUser = async (
    notificationId: string,
    userId: string
  ): Promise<boolean> => {
    const notification = await dbSingle<Notification>(this.collectionName, {
      id: notificationId,
    });

    if (null === notification) {
      throw new ApiException({
        code: ErrorCode.notificationNotFound,
        message: 'Could not find Notification',
        statusCode: 404,
      });
    }

    notification.users = notification.users!.map((user) => {
      if (user.id === userId) {
        user.status = NotificationStatus.READ;
      }
      return user;
    });

    return dbUpdate<Notification>(
      this.collectionName,
      { id: notificationId },
      {
        $set: {
          users: notification.users,
        },
      }
    );
  };
}
