import { User } from './user.model';

export interface AuthResponse {
  jwt: string;
  user: User;
}
