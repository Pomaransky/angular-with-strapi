/**
 * post controller
 */

import { factories } from '@strapi/strapi';
import { USER_MODEL_UID } from '../../../utils/user-ban';

type PostAuthor = {
  id?: number;
  banType?: string | null;
};

type PostEntity = {
  author?: PostAuthor | number | null;
};

function viewerIsShadowbanned(viewer: { banType?: string | null } | undefined): boolean {
  return viewer?.banType === 'shadow';
}

function applyShadowbanAuthorFilter(
  ctx: { state: { user?: { banType?: string | null } }; query?: Record<string, unknown> },
) {
  const viewer = ctx.state.user;
  if (viewerIsShadowbanned(viewer)) {
    return;
  }

  const existingFilters = (ctx.query?.filters ?? {}) as Record<string, unknown>;
  const existingAuthorFilter =
    typeof existingFilters.author === 'object' && existingFilters.author !== null
      ? (existingFilters.author as Record<string, unknown>)
      : {};

  ctx.query = {
    ...ctx.query,
    filters: {
      ...existingFilters,
      author: {
        ...existingAuthorFilter,
        $or: [
          { banType: { $null: true } },
          { banType: { $ne: 'shadow' } },
        ],
      },
    },
  };
}

async function resolvePostAuthor(
  strapi: { db: { query: Function } },
  post: PostEntity,
): Promise<PostAuthor | null> {
  const author = post.author;

  if (author && typeof author === 'object') {
    return author;
  }

  if (!author) {
    return null;
  }

  return strapi.db.query(USER_MODEL_UID).findOne({
    where: { id: author },
    select: ['id', 'banType'],
  });
}

function isPostHiddenByShadowban(
  author: PostAuthor | null,
  viewer: { id?: number; banType?: string | null } | undefined,
): boolean {
  if (!author || author.banType !== 'shadow') {
    return false;
  }

  if (viewerIsShadowbanned(viewer)) {
    return false;
  }

  return !viewer?.id || viewer.id !== author.id;
}

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async find(ctx) {
    applyShadowbanAuthorFilter(ctx);
    return super.find(ctx);
  },

  async findOne(ctx) {
    const response = await super.findOne(ctx);
    const post = response?.data as PostEntity | undefined;

    if (!post) {
      return response;
    }

    const author = await resolvePostAuthor(strapi, post);

    if (isPostHiddenByShadowban(author, ctx.state.user)) {
      return ctx.notFound();
    }

    return response;
  },
}));
