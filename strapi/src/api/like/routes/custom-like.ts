export default {
  routes: [
    {
      method: 'POST',
      path: '/likes/toggle',
      handler: 'like.toggle',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/likes/status',
      handler: 'like.status',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
