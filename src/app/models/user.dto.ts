export interface User {
  id: string;
  username: string;
  password: string;
  roles: string[];
  client: string;
}

export enum Roles {
  Master = 'Master',
  Admin = 'Admin',
  User = 'User'
}