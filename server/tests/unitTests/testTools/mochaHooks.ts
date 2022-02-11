import http from 'http';
import { Application } from 'express';
import PORT from './serverPort';
import { createServer } from '../../../src/server';

interface UserAccount {
  username: string;
  password: string;
}

const AdminUser: UserAccount = {
  username: 'user0',
  password: '123456789'
};

const IncorrectPasswordUser: UserAccount = {
  username: 'user0',
  password: 'INCORRECT PASSWORD'
};

export const Accounts = {
  AdminUser,
  IncorrectPasswordUser
};

export const setupApp = () => {
  return createServer();
};

export const setupHttpServer = (testApp: Application) => {
  const httpServer = http.createServer(testApp);
  httpServer.listen(PORT);
  return httpServer;
};

export const attemptAuthentication = (agent: any, done: Mocha.Done, userAccount: UserAccount = AdminUser) => {
  // Something weird going on with content type, explicitly using a different content type to make it https://stackoverflow.com/questions/38078569/seem-to-have-the-wrong-content-type-when-posting-with-chai-http
  agent
    .post('/api/auth/login')
    .set('content-type', 'application/json')
    .send(userAccount)
    .then((res: any) => {});
  console.log('here 0');
};
