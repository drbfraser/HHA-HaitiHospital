import http from 'http';
import { Application } from 'express';
import PORT from './serverPort';
import { createServer, setServerPort } from '../../../src/server';
import { endianness } from 'os';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
interface UserAccount {
  username: string;
  password: string;
}

const AdminUser: UserAccount = {
  username: 'user0',
  password: 'catdog'
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
  const app: Application = createServer();
  return app;
};

export const setupHttpServer = (testApp: Application) => {
  const httpServer = http.createServer(testApp);
  httpServer.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
  });
  return httpServer;
};

export const closeServer = (agent: any, httpServer: http.Server) => {
  agent.close();
  httpServer.close();
};

export const getCSRFToken = (app: Application, done: Mocha.Done) => {
  let csrf: String = '';

  chai.request
    .agent(app)
    .get('/api/auth/csrftoken')
    .end((error, res) => {
      if (error) done(error);
      csrf = res?.body?.CSRFToken;
      done();
    });

  return csrf;
};

export const attemptAuthentication = (app: Application, csrf: String, done: Mocha.Done, userAccount: UserAccount = AdminUser) => {
  // Something weird going on with content type, explicitly using a different content type to make it https://stackoverflow.com/questions/38078569/seem-to-have-the-wrong-content-type-when-posting-with-chai-http

  chai.request
    .agent(app)
    .post('/api/auth/login')
    .send(userAccount)
    .set('Content-Type', 'application/json')
    .set('CSRF-Token', csrf)
    .end((error: any, response: any) => {
      if (error) done(error);
      done();
    });
  console.log('here 0');
};
