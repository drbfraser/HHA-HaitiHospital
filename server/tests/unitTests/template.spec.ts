import { QuestionGroup } from '@hha/common';
import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF_ENDPOINT, LOGIN_ENDPOINT, TEMPLATE_ENDPOINT } from './testTools/endPoints';
import { ITemplate, TemplateCollection } from 'models/template';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: String;
let testTemplate: ITemplate;

describe('template tests', function () {
  before('Create a Working Server and Login With Admin', function (done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);

    agent.get(CSRF_ENDPOINT).end(function (error, res) {
      if (error) done(error);
      csrf = res?.body?.CSRFToken;

      agent
        .post(LOGIN_ENDPOINT)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .send(Accounts.AdminUser)
        .end(function (error: any, response: any) {
          if (error) return done(error);
          done();
        });
    });
    TemplateCollection.find({})
      .lean()
      .then((templates: ITemplate[]) => {
        testTemplate = templates[0];
      });
  });

  after('Close a Working Server', function () {
    closeServer(agent, httpServer);
  });

  it('should fetch template correctly', function (done) {
    agent
      .get(`${TEMPLATE_ENDPOINT}/${testTemplate.departmentId}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .end(function (err: any, res: any) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('template');
        expect(
          new QuestionGroup<string, string>('', res.body.template.reportObject) instanceof
            QuestionGroup,
        ).to.be.true;
        done();
      });
  });
});
