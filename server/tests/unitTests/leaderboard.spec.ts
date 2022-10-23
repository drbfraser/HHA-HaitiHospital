import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let app: Application;
let httpServer: http.Server;
let agent: any;
let csrf: String;

describe('getLeaderboard', () => {
  before('Create a Working Server and Login With Admin', (done) => {
    app = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);

    agent.get('/api/auth/csrftoken').end((error, res) => {
      if (error) done(error);
      csrf = res?.body?.CSRFToken;

      agent
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .set('CSRF-Token', csrf)
        .send(Accounts.AdminUser)
        .end((error: any, response: any) => {
          if (error) return done(error);
          done();
        });
    });
  });

  after('Close a Working Server', () => {
    closeServer(agent, httpServer);
  });

  it('should get all leaderboard points', (done) => {
    agent.get('/api/leaderboard').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });
});
