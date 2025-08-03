import { UserRole } from './user-role.model';

export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}
