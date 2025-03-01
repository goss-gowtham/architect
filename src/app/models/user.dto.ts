import { CardDTO } from './clients.dto'

export interface User {
  id: string;
  username: string;
  password: string;
  roles: string[];
  client: string;
  projects: CardDTO[];
  email?: string;
  phone?: string;
  storage?: number;
}

export enum Roles {
  master = 'master',
  admin = 'admin',
  user = 'user'
}