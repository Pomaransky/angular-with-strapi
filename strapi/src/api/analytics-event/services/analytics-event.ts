import { factories } from '@strapi/strapi';

const ANALYTICS_EVENT_UID = 'api::analytics-event.analytics-event';
const ANALYTICS_COUNTER_UID = 'api::analytics-counter.analytics-counter';

const ALLOWED_EVENT_TYPES = ['page_view_login', 'page_view_register'] as const;
type AllowedEventType = (typeof ALLOWED_EVENT_TYPES)[number];

function isAllowedEventType(value: unknown): value is AllowedEventType {
  return typeof value === 'string' && ALLOWED_EVENT_TYPES.includes(value as AllowedEventType);
}

export default factories.createCoreService(ANALYTICS_EVENT_UID, ({ strapi }) => ({
  async track(payload: {
    eventType: string;
    metadata?: Record<string, unknown>;
    sessionId?: string;
    userId?: number;
  }) {
    const { eventType, metadata, sessionId, userId } = payload;

    if (!isAllowedEventType(eventType)) {
      const error = new Error('Invalid eventType');
      (error as Error & { status: number }).status = 400;
      throw error;
    }

    const now = new Date();

    await strapi.documents(ANALYTICS_EVENT_UID).create({
      data: {
        eventType,
        ...(metadata !== undefined ? { metadata: metadata as Record<string, string | number | boolean | null> } : {}),
        sessionId,
        ...(userId ? { user: userId } : {}),
      },
    });

    const existingCounter = await strapi.db.query(ANALYTICS_COUNTER_UID).findOne({
      where: { eventType },
    });

    if (existingCounter) {
      const currentCount = Number(existingCounter.count ?? 0) || 0;
      await strapi.db.query(ANALYTICS_COUNTER_UID).update({
        where: { id: existingCounter.id },
        data: {
          count: currentCount + 1,
          lastOccurredAt: now,
        },
      });
    } else {
      await strapi.db.query(ANALYTICS_COUNTER_UID).create({
        data: {
          eventType,
          count: 1,
          lastOccurredAt: now,
        },
      });
    }

    return { ok: true };
  },
}));
