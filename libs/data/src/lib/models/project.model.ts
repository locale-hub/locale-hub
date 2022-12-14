import { UserGroupEntry } from './user-group-entry.model';

export interface Project {
  id: string;
  organizationId: string;
  userId: string;
  name: string;
  defaultLocale: string;
  archived: boolean;
  users: UserGroupEntry[];
  userGroups: UserGroupEntry[];
  createdAt: string;
}
