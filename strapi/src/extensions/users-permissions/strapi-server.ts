import {
  clearExpiredTimeBanIfNeeded,
  normalizeBanFields,
  USER_MODEL_UID,
} from '../../utils/user-ban';

const ALLOWED_UPDATE_ME_FIELDS = [
  'firstName',
  'lastName',
  'aboutMe',
  'birthDate',
] as const;

function pickAllowedUpdateMeFields(
  body: Record<string, unknown>,
): Record<string, unknown> {
  return ALLOWED_UPDATE_ME_FIELDS.reduce<Record<string, unknown>>((acc, key) => {
    if (key in body) {
      acc[key] = body[key];
    }
    return acc;
  }, {});
}

async function findUserByIdentifier(identifier: string) {
  return strapi.db.query(USER_MODEL_UID).findOne({
    where: {
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    },
  });
}

export default (plugin) => {
  plugin.controllers = plugin.controllers || {};
  plugin.controllers.user = plugin.controllers.user || {};
  plugin.controllers.auth = plugin.controllers.auth || {};

  const authController = plugin.controllers.auth;
  const originalAuthCallback = authController.callback?.bind(authController);

  if (originalAuthCallback) {
    authController.callback = async (ctx) => {
      const provider = ctx.params.provider || 'local';

      if (provider === 'local') {
        const identifier = ctx.request.body?.identifier;
        if (identifier) {
          const user = await findUserByIdentifier(identifier);
          if (user) {
            await clearExpiredTimeBanIfNeeded(strapi, user);
          }
        }
      }

      return originalAuthCallback(ctx);
    };
  }

  plugin.controllers.user.find = async (ctx) => {
    await strapi.contentAPI.validate.query(ctx.query, strapi.getModel(USER_MODEL_UID), {
      auth: ctx.state.auth,
    });
    const sanitizedQuery = await strapi.contentAPI.sanitize.query(
      ctx.query,
      strapi.getModel(USER_MODEL_UID),
      { auth: ctx.state.auth }
    );

    const page = Math.max(1, Number(ctx.query?.pagination?.page) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(ctx.query?.pagination?.pageSize) || 25)
    );
    const queryWithPagination = { ...sanitizedQuery, pagination: { page, pageSize } };

    const queryParams = strapi.get("query-params").transform(
      USER_MODEL_UID,
      queryWithPagination
    );
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const query = { ...queryParams, limit, offset };

    const [users, total] = await Promise.all([
      strapi.db.query(USER_MODEL_UID).findMany(query),
      strapi.db.query(USER_MODEL_UID).count({ where: queryParams.where || {} }),
    ]);

    const schema = strapi.getModel(USER_MODEL_UID);
    const data = await Promise.all(
      users.map((user) =>
        strapi.contentAPI.sanitize.output(user, schema, { auth: ctx.state.auth })
      )
    );

    const pageCount = Math.ceil(total / pageSize);
    ctx.body = {
      data,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount,
          total,
        },
      },
    };
  };

  const originalUserMe = plugin.controllers.user.me?.bind(plugin.controllers.user);

  if (originalUserMe) {
    plugin.controllers.user.me = async (ctx) => {
      const user = ctx.state.user;
      if (user) {
        const cleared = await clearExpiredTimeBanIfNeeded(strapi, user);
        if (cleared) {
          ctx.state.user = await strapi.db.query(USER_MODEL_UID).findOne({
            where: { id: user.id },
            populate: ['role'],
          });
        }
      }

      return originalUserMe(ctx);
    };
  }

  const originalUserUpdate = plugin.controllers.user.update?.bind(
    plugin.controllers.user,
  );

  if (originalUserUpdate) {
    plugin.controllers.user.update = async (ctx) => {
      const data = ctx.request.body as Record<string, unknown> | undefined;
      if (data && ('banType' in data || 'banExpiresAt' in data || 'blocked' in data)) {
        try {
          normalizeBanFields(data);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Invalid ban configuration';
          return ctx.badRequest(message);
        }
      }

      return originalUserUpdate(ctx);
    };
  }

  plugin.controllers.user.updateMe = async (ctx) => {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("You must be logged in to update your profile.");
      }

      const data = pickAllowedUpdateMeFields(
        (ctx.request.body ?? {}) as Record<string, unknown>,
      );

      const updatedUser = await strapi
        .documents(USER_MODEL_UID)
        .update({
          documentId: user.documentId,
          data,
        });

      return ctx.send(updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
      return ctx.badRequest("Unable to update user.");
    }
  };

  const originalContentApi = plugin.routes?.["content-api"];

  plugin.routes["content-api"] = (strapi) => {
    const routesDef =
      typeof originalContentApi === "function"
        ? originalContentApi(strapi)
        : { type: "content-api", routes: [] };

    routesDef.routes.push({
      method: "PUT",
      path: "/user/me",
      handler: "user.updateMe",
      config: {
        prefix: "",
        policies: [],
      },
    });

    return routesDef;
  };

  return plugin;
};
