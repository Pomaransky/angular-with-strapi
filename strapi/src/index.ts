import type { Core } from '@strapi/strapi';

async function checkIfUserDataExists(userId: string) {
  const existingUserProfile = await strapi
    .documents("api::user-data.user-data")
    .findMany({
      filters: {
        user: {
          id: {
            $eq: userId,
          },
        },
      },
    });

  return existingUserProfile;
}

async function createUserData(userId: string) {
  const userProfile = await checkIfUserDataExists(userId);

  if (userProfile.length > 0) {
    return;
  }

  const newUserData = await strapi.documents("api::user-data.user-data").create({
    data: {
      user: userId,
    },
  });

  await strapi.documents("api::user-data.user-data").publish({
    documentId: newUserData.documentId,
  });
}

async function deleteUserData(userId: string) {
  const userProfile = await checkIfUserDataExists(userId);

  if (userProfile.length > 0) {
    await strapi.documents("api::user-data.user-data").delete({
      documentId: userProfile[0].documentId,
    });
  }
}


export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async afterCreate (event) {
        const { result } = event;
        await createUserData(result.id);
      },
      async beforeDelete (event: any) {
        const { params } = event;
        const idToDelete = params?.where?.id;
        await deleteUserData(idToDelete);
      },
    });
  },
};
