import http, { request } from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts } from './testTools/mochaHooks';
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
let csrf: String;

describe('Test Admin Authorization', () => {
  before('Create a Working Server and Login With Admin', (done) => {
    app = setupApp();
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
    // httpServer.close();
    agent.close();
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
