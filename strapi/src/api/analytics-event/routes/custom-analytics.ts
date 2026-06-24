export default {
  routes: [
    {
      method: 'POST',
      path: '/analytics/track',
      handler: 'analytics-event.track',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
