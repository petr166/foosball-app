// @ts-ignore

module.exports = {
  client: {
    includes: ['./src/**/*.{ts,tsx}'],
    excludes: ['**/node_modules', '**/__tests__', 'android', 'ios'],
    service: {
      name: 'my-service',
      url: 'http://localhost:4000/graphql',
    },
  },
};
