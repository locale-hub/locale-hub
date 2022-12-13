import {Email} from './email.model';

export type User = {
  id: string;
  name: string;
  primaryEmail: string;
  emails: Email[];
  password: string;
  passwordSalt: string;
  role?: string;
  createdAt: string;
}
