import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF_ENDPOINT, DEPARTMENT_ENDPOINT, EMPLOYEE_OF_THE_MONTH_ENDPOINT, IMAGE_ENDPOINT, LOGIN_ENDPOINT, USERS_ENDPOINT } from './testTools/endPoints';
import { Done } from 'mocha';
import { Department } from 'models/departments';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: String;

function getDepartments() {
  return agent.get(DEPARTMENT_ENDPOINT);
}

describe('Employee of the Month Tests', function () {
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
  });

  after('Close a Working Server', function () {
    closeServer(agent, httpServer);
  });

  it.only('Should Successfully Get the Employee of the Month', async function () {
    // Get a department because it is needed in the PUT request
    const departments = await getDepartments();
    const generalDepartment: Department = departments.body[0];

    const imgPath: String = 'public/images/avatar1.jpg';
    const document: String = `{"name": 'John Doe',
      'department':${generalDepartment},
      "description":"This is my description!"}`;

    const response = await agent
                            .put(EMPLOYEE_OF_THE_MONTH_ENDPOINT)
                            .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
                            .field('document', document)
                            .attach('file', imgPath);
    console.log(response.body);                            
    expect(response).to.have.status(200);
  });
});
