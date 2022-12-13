import {User} from './user.model';

export interface JwtModel {
  user: User;
  lastLogin?: string;
}

