export const USER_BAN_TYPES = ['shadow', 'time', 'perm'] as const;
export type UserBanType = (typeof USER_BAN_TYPES)[number];

export const USER_MODEL_UID = 'plugin::users-permissions.user';

export function hasActiveBan(banType: string | null | undefined): boolean {
  return !!banType && USER_BAN_TYPES.includes(banType as UserBanType);
}

export function isTimeBanActive(
  banType: string | null | undefined,
  banExpiresAt: string | Date | null | undefined,
  now: Date = new Date(),
): boolean {
  if (banType !== 'time' || !banExpiresAt) {
    return false;
  }
  return new Date(banExpiresAt).getTime() > now.getTime();
}

export function computeBlockedFromBan(
  banType: string | null | undefined,
  banExpiresAt: string | Date | null | undefined,
  now: Date = new Date(),
): boolean {
  if (banType === 'perm') {
    return true;
  }
  if (banType === 'time') {
    return isTimeBanActive(banType, banExpiresAt, now);
  }
  return false;
}

export function normalizeBanFields(
  data: Record<string, unknown>,
  now: Date = new Date(),
): void {
  if (!('banType' in data) && !('banExpiresAt' in data) && !('blocked' in data)) {
    return;
  }

  const rawBanType = data.banType as string | null | undefined;

  if (
    rawBanType === null ||
    rawBanType === undefined ||
    rawBanType === '' ||
    rawBanType === 'none'
  ) {
    data.banType = null;
    data.banExpiresAt = null;
    data.blocked = false;
    return;
  }

  if (!USER_BAN_TYPES.includes(rawBanType as UserBanType)) {
    throw new Error('Invalid ban type');
  }

  if (rawBanType === 'time') {
    if (!data.banExpiresAt) {
      throw new Error('banExpiresAt is required for time bans');
    }
    if (new Date(data.banExpiresAt as string).getTime() <= now.getTime()) {
      throw new Error('banExpiresAt must be in the future');
    }
  } else {
    data.banExpiresAt = null;
  }

  data.banType = rawBanType;
  data.blocked = computeBlockedFromBan(
    rawBanType,
    data.banExpiresAt as string | Date | null | undefined,
    now,
  );
}

export function isExpiredTimeBan(
  banType: string | null | undefined,
  banExpiresAt: string | Date | null | undefined,
  now: Date = new Date(),
): boolean {
  return (
    banType === 'time' &&
    !!banExpiresAt &&
    new Date(banExpiresAt).getTime() <= now.getTime()
  );
}

export async function clearExpiredTimeBanIfNeeded(
  strapi: { db: { query: Function }; documents: Function },
  user: {
    id: number;
    documentId: string;
    banType?: string | null;
    banExpiresAt?: string | Date | null;
  },
): Promise<boolean> {
  if (!isExpiredTimeBan(user.banType, user.banExpiresAt)) {
    return false;
  }

  await strapi.documents(USER_MODEL_UID).update({
    documentId: user.documentId,
    data: {
      banType: null,
      banExpiresAt: null,
      blocked: false,
    },
  });

  return true;
}

export async function clearAllExpiredTimeBans(
  strapi: { db: { query: Function }; documents: Function },
): Promise<number> {
  const now = new Date();
  const users = await strapi.db.query(USER_MODEL_UID).findMany({
    where: {
      banType: 'time',
      banExpiresAt: { $lte: now },
    },
  });

  for (const user of users) {
    await clearExpiredTimeBanIfNeeded(strapi, user);
  }

  return users.length;
}
