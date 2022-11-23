import {UserRoles} from '../enums/user-roles.enum';

export interface UserGroupEntry {
  id: string;
  role: UserRoles;
}
