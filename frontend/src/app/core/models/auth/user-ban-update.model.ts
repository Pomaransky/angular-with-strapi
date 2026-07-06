import { UserBanType } from './user-ban-type.enum';

export interface UserBanUpdate {
  banType: UserBanType | null;
  banExpiresAt?: string | null;
}
