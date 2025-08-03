import { UserRoleType } from './user-role-type.enum';

export interface UserRole {
  id: number;
  name: string;
  description: string;
  type: UserRoleType;
}
