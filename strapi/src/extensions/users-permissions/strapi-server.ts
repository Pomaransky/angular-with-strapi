const USER_MODEL_UID = "plugin::users-permissions.user";

export default (plugin) => {
  plugin.controllers = plugin.controllers || {};
  plugin.controllers.user = plugin.controllers.user || {};

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

  plugin.controllers.user.updateMe = async (ctx) => {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("You must be logged in to update your profile.");
      }

      const data = ctx.request.body;

      const updatedUser = await strapi
        .documents("plugin::users-permissions.user")
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