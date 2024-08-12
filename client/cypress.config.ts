import { defineConfig } from 'cypress';
import fs from 'fs-extra';
import path from 'path';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        deleteFile(filePath: string) {
          console.log('Deleting file %s', filePath);
          fs.remove(path.resolve(filePath));
          return null;
        },
        getDownloadedFiles(folderName: string) {
          return fs.readdir(path.resolve(folderName)).then((files: string[]) => {
            return files;
          });
        },
      });
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
      };
    },
  },
  experimentalInteractiveRunEvents: true,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'mochawesome',
    mochawesomeReporterOptions: {
      reportDir: 'cypress/reports/mocha',
      quite: true,
      overwrite: false,
      html: false,
      json: true,
    },
  },
  downloadsFolder: 'cypress/downloads',
  retries: {
    runMode: 2,
  },
  downloadsFolder: 'cypress/downloads',
});
