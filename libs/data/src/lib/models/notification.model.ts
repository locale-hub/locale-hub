import {NotificationStatus} from '../enums/notification-status.enum';

export interface Notification {
  id: string;
  title: string;
  text?: string;
  img?: string;
  link?: string;
  users: { id: string; status: NotificationStatus; }[];
  createdAt: string;
}
