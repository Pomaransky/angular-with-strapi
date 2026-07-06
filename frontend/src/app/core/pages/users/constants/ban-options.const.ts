import { UserBanType } from '../../../models';

export const BAN_TYPE_OPTIONS = [
  { label: 'users.ban.type.perm', value: UserBanType.PERM },
  { label: 'users.ban.type.time', value: UserBanType.TIME },
  { label: 'users.ban.type.shadow', value: UserBanType.SHADOW },
];

export const BAN_DURATION_PRESETS = [
  { label: 'users.ban.duration.5m', minutes: 5 },
  { label: 'users.ban.duration.1h', minutes: 60 },
  { label: 'users.ban.duration.7d', minutes: 60 * 24 * 7 },
  { label: 'users.ban.duration.30d', minutes: 60 * 24 * 30 },
];
