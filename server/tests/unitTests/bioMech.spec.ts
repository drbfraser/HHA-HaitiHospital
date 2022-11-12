import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { CSRF_ENDPOINT, LOGIN_ENDPOINT, BIOMECH_ENDPOINT } from './testTools/endPoints';
import { Done } from 'mocha';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: string;
let bioMechIds: string[];

interface BioMechReport {
  equipmentName: string;
  equipmentFault: string;
  equipmentPriority: 'urgent' | 'non-urgent' | 'important';
  file: {
    fieldname?: string;
    originalname?: string;
    encoding?: string;
    mimetype?: string;
    destination?: string;
    filename?: string;
    path: string;
    size?: number;
  };
}

function postBioMech(bioMechReport: BioMechReport, imgPath: String, done: Done, expectedStatus: Number, next?: Function) {
  agent
    .post(BIOMECH_ENDPOINT)
    .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
    .field('equipmentName', bioMechReport.equipmentName)
    .field('equipmentFault', bioMechReport.equipmentFault)
    .field('equipmentPriority', bioMechReport.equipmentPriority)
    .attach('file', imgPath)
    .end(function (error: any, response: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(expectedStatus);
      if (!next) done();
      else next(done);
    });
}

function updatePostedBioMechIds(done: Done) {
  agent.get(BIOMECH_ENDPOINT).end(function (error: any, response: any) {
    if (error) done(error);
    bioMechIds.push(response.body[0].id);
    done();
  });
}

describe('Bio Mech Tests', function () {
  before('Create a Working Server and Login With Admin', function (done: Done) {
    let app: Application = setupApp();
    httpServer = setupHttpServer(app);
    agent = chai.request.agent(app);
    bioMechIds = Array<string>();

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
    // Clean up created bio mechs that were not deleted during testing
    for await (const bioMechId of bioMechIds) {
      try {
        await agent.delete(`${BIOMECH_ENDPOINT}/${bioMechId}`).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });
      } catch (error: any) {
        console.log(error);
      }
    }
    closeServer(agent, httpServer);
  });

  it('Should Successfully Get All Biomech Reports', function (done: Done) {
    agent.get(BIOMECH_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(200);
      done();
    });
  });

  it('Should Successfully Get a Biomech Report by ID', function (done: Done) {
    // Get all reports to grab an ID
    agent.get(BIOMECH_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      expect(error).to.be.null;

      const bioMechReport = response.body[0];
      const id: string = bioMechReport.id;
      agent.get(`${BIOMECH_ENDPOINT}/${id}`).end(function (error: any, response: any) {
        if (error) done(error);
        expect(response).to.have.status(200);
        expect(response.body).to.deep.equal(bioMechReport);
        done();
      });
    });
  });

  it('Should Successfully Post a New Biomech Report', function (done: Done) {
    const imgPath: string = 'public/images/bioMech0.jpeg';

    const bioMechReport: BioMechReport = {
      equipmentName: 'Test Equipment',
      equipmentFault: 'It is broken',
      equipmentPriority: 'urgent',
      file: { path: imgPath }
    };
    postBioMech(bioMechReport, imgPath, done, 201, updatePostedBioMechIds);
  });

  it('Should Successfully Delete a Biomech Report', function (done: Done) {
    agent.get(BIOMECH_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      expect(error).to.be.null;

      const bioMechReport = response.body[0];
      const id: string = bioMechReport.id;
      agent
        .delete(`${BIOMECH_ENDPOINT}/${id}`)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .end(function (error: any, response: any) {
          if (error) done(error);
          expect(response).to.have.status(204);
          done();
        });
    });
  });

  it('Should Unsuccessfully Delete a Biomech Report Due to Invalid ID', function (done: Done) {
    agent
      .delete(`${BIOMECH_ENDPOINT}/${'Invalid'}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .end(function (error: any, response: any) {
        if (error) done(error);
        expect(response).to.have.status(500);
        done();
      });
  });
});
