import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return {
        ...config,
        baseUrl: 'http://localhost:3000',
        env: {
          baseUrl: 'http://localhost:3000',
          serverUrl: 'http://localhost:8000',
          Admin: { username: 'user0', password: 'catdog' },
          MedicalDirector: { username: 'user1', password: 'catdog' },
          HeadOfDepartment: { username: 'user2', password: 'catdog' },
          User: { username: 'user3', password: 'catdog' },
        },
      };
    },
  },
});
