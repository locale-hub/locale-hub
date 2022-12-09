import {NotificationStatus} from '../enums/notification-status.enum';

export interface Notification {
  id: string;
  title: string;
  text?: string;
  img?: string;
  link?: string;
  status: NotificationStatus;
  createdAt: string;
}
