import { Application } from 'express';
import { createServer, setServerPort } from './server';
import * as ENV from './utils/processEnv';

const startServer = () => {
  const app: Application = createServer();
  setServerPort(app, ENV.SERVER_PORT || 5000);
};

startServer();