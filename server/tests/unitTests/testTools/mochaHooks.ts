import http from 'http';
import { Application } from 'express';
import PORT from './serverPort';
import { createServer, setServerPort } from '../../../src/server';
import { endianness } from 'os';

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

const getCSRFToken = (agent: any) => {
  let csrf: String = '';
  try {
    agent.get('/api/auth/csrftoken').end((error, res) => {
      csrf = res?.body?.CSRFToken;
    });
  } catch (error) {
    console.log(error);
  }
  return csrf;
};

export const attemptAuthentication = (agent: any, done: Mocha.Done, userAccount: UserAccount = AdminUser) => {
  // Something weird going on with content type, explicitly using a different content type to make it https://stackoverflow.com/questions/38078569/seem-to-have-the-wrong-content-type-when-posting-with-chai-http

  const csrf: String = getCSRFToken(agent);

  try {
    agent
      .post('/api/auth/login')
      .send(userAccount)
      .set('CSRF-Token', csrf)
      .set('content-type', 'application/json')
      .then((res: any) => {})
      .end((error: any, response: any) => {
        if (error) done(error);
        done();
      });
  } catch (error: any) {
    console.log(error);
  }
  console.log('here 0');
};
