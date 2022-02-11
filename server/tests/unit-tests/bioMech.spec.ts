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

describe('getBioMechReports', () => {
  before('Create a working server', (done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.AdminUser);
  });

  after('Close a working server', () => {
    httpServer.close();
    agent.close();
  });

  it('should get all biomechanic reports successfully', (done) => {
    agent.get('/api/biomech').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });
});