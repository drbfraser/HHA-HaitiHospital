import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return {
        ...config,
        baseUrl: 'http://localhost:3000',
        env: {
          serverUrl: 'http://localhost:8000',
          username: 'user0',
          password: 'catdog',
        },
      };
    },
  },
});
