import { factories } from '@strapi/strapi';

const LIKE_UID = 'api::like.like';

type AuthUser = {
  id: number;
  documentId?: string;
  banType?: string | null;
};

async function resolveAuthUser(
  strapi: { plugin: Function },
  ctx: { state: { user?: AuthUser }; request: { header: { authorization?: string } } },
): Promise<AuthUser | null> {
  if (ctx.state.user?.id) {
    return ctx.state.user;
  }

  const jwtService = strapi.plugin('users-permissions').service('jwt');
  const userService = strapi.plugin('users-permissions').service('user');
  const token = await jwtService.getToken(ctx);

  if (!token?.id) {
    return null;
  }

  return userService.fetchAuthenticatedUser(token.id);
}

export default factories.createCoreController(LIKE_UID, ({ strapi }) => ({
  async toggle(ctx) {
    const user = await resolveAuthUser(strapi, ctx);
    if (!user) {
      return ctx.unauthorized('You must be logged in to like a post');
    }

    const { postDocumentId } = ctx.request.body ?? {};
    if (!postDocumentId || typeof postDocumentId !== 'string') {
      return ctx.badRequest('postDocumentId is required');
    }

    try {
      const result = await strapi.service(LIKE_UID).toggle({
        postDocumentId,
        user,
      });
      ctx.body = { data: result };
    } catch (error) {
      const status = (error as Error & { status?: number }).status ?? 500;
      ctx.status = status;
      ctx.body = {
        error: {
          message: error instanceof Error ? error.message : 'Failed to toggle like',
        },
      };
    }
  },

  async status(ctx) {
    const user = await resolveAuthUser(strapi, ctx);
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    const { postDocumentIds } = ctx.request.body ?? {};
    if (!Array.isArray(postDocumentIds)) {
      return ctx.badRequest('postDocumentIds must be an array');
    }

    try {
      const likedPostDocumentIds = await strapi.service(LIKE_UID).getLikedPostIds({
        postDocumentIds,
        userId: user.id,
      });
      ctx.body = { data: { likedPostDocumentIds } };
    } catch (error) {
      const status = (error as Error & { status?: number }).status ?? 500;
      ctx.status = status;
      ctx.body = {
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch like status',
        },
      };
    }
  },
}));
