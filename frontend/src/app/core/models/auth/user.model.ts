import { Media } from '../media.type';
import { UserRole } from './user-role.model';
import { UserBanType } from './user-ban-type.enum';

export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  banType?: UserBanType | null;
  banExpiresAt?: string | null;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  aboutMe?: string;
  birthDate?: string;
  avatar?: Media;
  createdAt?: string;
}
