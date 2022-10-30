import http, { request } from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer, getCSRFToken } from './testTools/mochaHooks';
import { CSRF, LOGIN, USERS, LOGOUT } from './testTools/endPoints';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let app: Application;
let agent: any;
let httpServer: http.Server;
let csrf: String;

describe('Test Admin Authorization', function () {
  before('Create a Working Server and Login With Admin', function (done) {
    app = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);

    agent.get(CSRF).end(function (error, res) {
      if (error) done(error);
      csrf = res?.body?.CSRFToken;

      agent
        .post(LOGIN)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .send(Accounts.AdminUser)
        .end((error: any, response: any) => {
          if (error) return done(error);
          done();
        });
    });
  });

  after('Close a Working Server', function () {
    closeServer(agent, httpServer);
  });

  it.only('Should Fetch the Users', function (done) {
    agent.get(USERS).end(function (error: any, res: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });

  it('Should Logout Admin User', (done) => {
    agent
      .post(LOGOUT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .send({})
      .end((error: any, response: any) => {
        if (error) done(error);

        expect(error).to.be.null;
        expect(response.body).to.be.true;
        done();
      });
  });
});
