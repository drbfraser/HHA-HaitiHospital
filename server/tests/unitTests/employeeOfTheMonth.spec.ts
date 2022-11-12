import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF_ENDPOINT, DEPARTMENT_ENDPOINT, EMPLOYEE_OF_THE_MONTH_ENDPOINT, LOGIN_ENDPOINT } from './testTools/endPoints';
import { Done } from 'mocha';
import { deleteUploadedImage } from 'utils/unlinkImage';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: string;
let imgPaths: string[];

function getDepartments() {
  return agent.get(DEPARTMENT_ENDPOINT);
}

function updatePostedImgPaths(imgPath: string) {
  imgPaths.push(imgPath);
}

describe('Employee of the Month Tests', function () {
  before('Create a Working Server and Login With Admin', function (done: Done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);
    imgPaths = Array<string>();

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

  after('Close a Working Server', async function () {
    // Delete the images uploaded when EOTM is changed
    for await (const imgPath of imgPaths) {
      console.log('deleting: ' + imgPath);
      deleteUploadedImage(imgPath);
    }

    closeServer(agent, httpServer);
  });

  it.only('Should Successfully Get the Employee of the Month', function (done: Done) {
    agent.get(EMPLOYEE_OF_THE_MONTH_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(200);
      done();
    });
  });

  it('Should Successfully Change the Employee of the Month', async function () {
    // TODO: Prevent image from being deleted when test fails
    // Get a department because it is needed in the PUT request
    const departments = await getDepartments();
    const generalDepartment = departments.body[0];

    const imgPath: string = 'public/images/avatar1.jpg';
    const document: string = `{"name":"John","department":{"id":"${generalDepartment.id}","name":"${generalDepartment.name}"},"description":"John is incredible!"}`;
    const putResponse = await agent.put(EMPLOYEE_OF_THE_MONTH_ENDPOINT).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf }).field('document', document).attach('file', imgPath);
    expect(putResponse).to.have.status(200);

    const getResponse = await agent.get(EMPLOYEE_OF_THE_MONTH_ENDPOINT);
    expect(getResponse).to.have.status(200);
    expect(getResponse.body.name).to.equal('John');
    expect(getResponse.body.department).to.deep.equal(generalDepartment);
    expect(getResponse.body.description).to.equal('John is incredible!');
    updatePostedImgPaths(getResponse.body.imgPath);
  });

  it.only('Should Unsuccessfully Change the Employee of the Month Due To Invalid Department Id', async function () {
    // TODO: Prevent image from being deleted when test fails
    // Get a department because it is needed in the PUT request
    const departments = await getDepartments();
    const generalDepartment = departments.body[0];

    const imgPath: string = 'public/images/avatar1.jpg';
    const document: string = `{"name":"John","department":{"id":"Invalid Id","name":"${generalDepartment.name}"},"description":"John is incredible!"}`;
    const putResponse = await agent.put(EMPLOYEE_OF_THE_MONTH_ENDPOINT).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf }).field('document', document).attach('file', imgPath);
    expect(putResponse).to.have.status(500);
    console.log('putResponse: ' + JSON.stringify(putResponse));
    const getResponse = await agent.get(EMPLOYEE_OF_THE_MONTH_ENDPOINT);
    updatePostedImgPaths(getResponse.body.imgPath);
  });
});
