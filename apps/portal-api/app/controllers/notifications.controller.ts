import {Request, Response, Router as createRouter} from 'express';
import {sendError} from '../logic/helpers/sendError.helper';
import {discardNotificationForUser, getNotificationsForUser} from '../logic/services/notification.service';
import { NotificationStatus } from '@locale-hub/data/enums/notification-status.enum';

const router = createRouter({mergeParams: true});

/**
 * List user notifications
 */
router.get('', async function(req: Request, res: Response) {
  try {
    const userId = req.user.id;

    const list = [
      ...(await getNotificationsForUser(userId, NotificationStatus.UNREAD)),
      ...(await getNotificationsForUser(userId, NotificationStatus.READ)),
    ].sort((n1, n2) => {
      return new Date(n2.createdAt).getTime() - new Date(n1.createdAt).getTime();
    });

    const notifications = list.map((notification) => {
      const status = notification.users
        .filter((u) => userId === u.id)[0]
        .status ??
        NotificationStatus.UNREAD;

      return {
        id: notification.id,
        title: notification.title,
        text: notification.text,
        img: notification.img,
        link: notification.link,
        status,
        createdAt: notification.createdAt,
      };
    });

    res.json({
      notifications,
    });
  } catch (error) {
    sendError(res, error as Error);
  }
});

/**
 * List user notifications
 */
router.delete('/:notificationId', async function(req: Request, res: Response) {
  try {
    const notificationId = req.params.notificationId;
    await discardNotificationForUser(notificationId, req.user.id);

    res.status(204).json();
  } catch (error) {
    sendError(res, error as Error);
  }
});


export default router;
