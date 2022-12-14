import { NotificationStatus } from '../enums/notification-status.enum';

// TODO: fix client/server side data difference
export interface Notification {
  id: string;
  title: string;
  text?: string;
  img?: string;
  link?: string;
  // server side
  users?: { id: string; status: NotificationStatus }[];
  // client side
  status?: NotificationStatus;
  createdAt: string;
}
