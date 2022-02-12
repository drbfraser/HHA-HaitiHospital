import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts } from './testTools/mochaHooks';
const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let testApp: Application;
let httpServer: http.Server;
let agent: any;

describe('Test Admin Authorization', () => {
  before('Create a working server', async (done) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        testApp = setupApp();
        httpServer = setupHttpServer(testApp);
        agent = chai.request.agent(testApp);
        attemptAuthentication(agent, done, Accounts.AdminUser);
      }, 200);
    }).catch((err) => {
      console.log(err);
    });
  });

  after('Close a working server', () => {
    httpServer.close();
  });

  it('should allow admin to get users', (done) => {
    agent.get('/api/users').end((err: any, res: any) => {
      console.log('TEST WE ARE HERE');
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });
});
