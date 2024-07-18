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
          Admin: { username: 'user0', password: 'C@td0g' },
          MedicalDirector: { username: 'user1', password: 'C@td0g' },
          HeadOfDepartment: { username: 'user2', password: 'C@td0g' },
          User: { username: 'user3', password: 'C@td0g' },
        },
        reporter: 'mochawesome',
        reporterOptions: {
          reportDir: 'cypress/reports',
          overwrite: false,
          html: true,
          json: true,
        },
      };
    },
  },
});
