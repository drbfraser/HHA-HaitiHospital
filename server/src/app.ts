import { Application } from 'express';
import { createServer, setServerPort } from './server';

const startServer = () => {
  const app: Application = createServer();
  setServerPort(app, parseInt(process.env.PORT) || 5000);
};

startServer();
