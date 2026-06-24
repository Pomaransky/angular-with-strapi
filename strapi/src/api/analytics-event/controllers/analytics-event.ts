import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::analytics-event.analytics-event', ({ strapi }) => ({
  async track(ctx) {
    const { eventType, metadata, sessionId } = ctx.request.body ?? {};
    const userId = ctx.state.user?.id;

    try {
      const result = await strapi
        .service('api::analytics-event.analytics-event')
        .track({ eventType, metadata, sessionId, userId });

      ctx.body = result;
    } catch (error) {
      const status = (error as Error & { status?: number }).status ?? 500;
      ctx.status = status;
      ctx.body = {
        error: {
          message: error instanceof Error ? error.message : 'Failed to track event',
        },
      };
    }
  },
}));
