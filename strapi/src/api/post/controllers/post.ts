/**
 * post controller
 */

import { factories } from '@strapi/strapi';
import { USER_MODEL_UID } from '../../../utils/user-ban';

const LIKE_UID = 'api::like.like';

type PostAuthor = {
  id?: number;
  banType?: string | null;
};

type PostEntity = {
  documentId?: string;
  likesTotal?: number | string;
  likedByMe?: boolean;
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

  const shadowbanAuthorCondition = {
    $or: [
      { banType: { $null: true } },
      { banType: { $ne: 'shadow' } },
    ],
  };

  const authorFilter =
    Object.keys(existingAuthorFilter).length === 0
      ? shadowbanAuthorCondition
      : { $and: [existingAuthorFilter, shadowbanAuthorCondition] };

  ctx.query = {
    ...ctx.query,
    filters: {
      ...existingFilters,
      author: authorFilter,
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

async function attachLikedByMe(
  strapi: { service: Function },
  posts: PostEntity[],
  userId?: number,
): Promise<PostEntity[]> {
  if (!posts.length) {
    return posts;
  }

  const normalized = posts.map((post) => ({
    ...post,
    likesTotal: Number(post.likesTotal ?? 0) || 0,
  }));

  if (!userId) {
    return normalized;
  }

  const postDocumentIds = normalized
    .map((post) => post.documentId)
    .filter((id): id is string => !!id);

  if (!postDocumentIds.length) {
    return normalized;
  }

  const likedPostDocumentIds = await strapi.service(LIKE_UID).getLikedPostIds({
    postDocumentIds,
    userId,
  });
  const likedIds = new Set(likedPostDocumentIds);

  return normalized.map((post) => ({
    ...post,
    likedByMe: post.documentId ? likedIds.has(post.documentId) : false,
  }));
}

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async find(ctx) {
    applyShadowbanAuthorFilter(ctx);
    const response = await super.find(ctx);
    const data = response?.data;

    if (!Array.isArray(data)) {
      return response;
    }

    response.data = await attachLikedByMe(strapi, data, ctx.state.user?.id);
    return response;
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

    const [enriched] = await attachLikedByMe(strapi, [post], ctx.state.user?.id);
    response.data = enriched;
    return response;
  },
}));
