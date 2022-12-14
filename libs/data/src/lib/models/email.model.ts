import { EmailStatus } from '../enums/email-status.enum';

export interface Email {
  email: string;
  status: EmailStatus;
  createdAt: string;
}
