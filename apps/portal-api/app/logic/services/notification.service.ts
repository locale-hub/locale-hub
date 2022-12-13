import { NotificationRepository } from '@locale-hub/data/repositories/notification.repository';
import { NotificationStatus } from '@locale-hub/data/enums/notification-status.enum';
import {Notification} from '@locale-hub/data/models/notification.model';

const notificationRepository = new NotificationRepository();

/**
 * List Notifications for a given user
 * @param {string} userId The project the apps should belongs to
 * @param {NotificationStatus} status type of notification desired
 * @return {Notification[]} List of notifications
 */
export const getNotificationsForUser = async (userId: string, status: NotificationStatus): Promise<Notification[]> => {
  return notificationRepository.getForUser(userId, status);
};

/**
 * Mark a user's notification as read
 * @param {string} notificationId The Notification to update
 * @param {string} userId A user id
 * @return {boolean} true if updated, false otherwise
 */
export const discardNotificationForUser = async (notificationId: string, userId: string): Promise<boolean> => {
  return await notificationRepository.discardForUser(notificationId, userId);
};
