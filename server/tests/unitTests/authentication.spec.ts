import http, { request } from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { doesNotMatch } from 'assert';
import { ADDRGETNETWORKPARAMS } from 'dns';
import { setServerPort } from '../../src/server';
import PORT from './testTools/serverPort';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let app: Application;
let agent: any;
let httpServer: http.Server;
let csrf: String;

describe('Test Admin Authorization', () => {
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

  it('Should Fetch the Users', (done) => {
    agent.get('/api/users').end((error: any, res: any) => {
      if (error) done(error);
      expect(error).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });
});
