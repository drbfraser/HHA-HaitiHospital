import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF_ENDPOINT, LOGIN_ENDPOINT, USERS_ENDPOINT } from './testTools/endPoints';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;

describe('getUsers', function () {
  before('Create a Working Server and Login With Admin', function (done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);

    agent.get(CSRF_ENDPOINT).end(function (error, res) {
      if (error) done(error);
      let csrf: String = res?.body?.CSRFToken;

      agent
        .post(LOGIN_ENDPOINT)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .send(Accounts.AdminUser)
        .end(function (error: any, response: any) {
          if (error) return done(error);
          done();
        });
    });
  });

  after('Close a Working Server', function () {
    closeServer(agent, httpServer);
  });
  it('should get all users successfully', function (done) {
    // There is probably a better way to auth before calling APIs that require auth
    agent
      .post(LOGIN_ENDPOINT)
      .set('content-type', 'application/json')
      .send(Accounts.AdminUser)
      .then(function (res: any) {
        agent.get(USERS_ENDPOINT).end(function (err: any, res: any) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
      })
      .catch(function (err: any) {
        done(err);
      });
  });
});
