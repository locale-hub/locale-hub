
export interface Organization {
  id: string;
  owner: string;
  name: string;
  users: string[]; // user emails
  createdAt: string;
}
