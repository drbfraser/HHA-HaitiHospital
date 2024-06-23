import http from 'http';
import { Accounts, closeServer, dropMongo, seedMongo, setUpSession } from 'testTools/mochaHooks';
import { BIOMECH_ENDPOINT } from 'testTools/endPoints';
import { Done } from 'mocha';
import {
  HTTP_CREATED_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_NOTFOUND_CODE,
  HTTP_OK_CODE,
} from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedBioMech } from 'seeders/seed';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: string;
let bioMechIds: string[];

const invalidId = '123456789012 ';

interface BioMechReport {
  equipmentName: string;
  equipmentFault: string;
  equipmentPriority: 'urgent' | 'non-urgent' | 'important';
  equipmentStatus: 'fixed' | 'in-progress' | 'backlog';
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

function postBioMech(
  bioMechReport: BioMechReport,
  imgPath: String,
  done: Done,
  expectedStatus: Number,
  next?: Function,
) {}

function updatePostedBioMechIds(done: Done) {
  agent.get(BIOMECH_ENDPOINT).end(function (error: any, response: any) {
    if (error) done(error);
    bioMechIds.push(response.body[0].id);
    done();
  });
}

describe('Bio Mech Tests', function () {
  let httpServer: http.Server;
  let agent: any;
  let csrf: String;
  let mongo: MongoMemoryServer;

  before('Create a Working Server and Login With Admin', async function () {
    const session = await setUpSession(Accounts.AdminUser);

    httpServer = session.httpServer;
    agent = session.agent;
    csrf = session.csrf;
    mongo = session.mongo;
  });

  after('Close a Working Server and delete any added reports', async function () {
    closeServer(agent, httpServer, mongo);
  });

  beforeEach('start with clean mongoDB', async function () {
    await seedMongo();
    await seedBioMech();
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('Should Successfully Get All Biomech Reports', function (done: Done) {
    agent.get(BIOMECH_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(HTTP_OK_CODE);
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
        expect(response).to.have.status(HTTP_OK_CODE);
        expect(response.body).to.deep.equal(bioMechReport);
        done();
      });
    });
  });

  it('Should Unsuccessfully Get a Biomech Report due to Invalid Id', function (done: Done) {
    agent.get(`${BIOMECH_ENDPOINT}/${invalidId}`).end(function (error: any, response: any) {
      if (error) done(error);
      expect(response).to.have.status(HTTP_NOTFOUND_CODE);
      done();
    });
  });

  it('Should Successfully Post a New Biomech Report', function (done: Done) {
    const imgPath: string = 'public/images/bioMech0.jpeg';

    const bioMechReport: BioMechReport = {
      equipmentName: 'Test Equipment',
      equipmentFault: 'It is broken',
      equipmentPriority: 'urgent',
      equipmentStatus: 'fixed',
      file: { path: imgPath },
    };
    agent
      .post(BIOMECH_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .field('equipmentName', bioMechReport.equipmentName)
      .field('equipmentFault', bioMechReport.equipmentFault)
      .field('equipmentPriority', bioMechReport.equipmentPriority)
      .field('equipmentStatus', bioMechReport.equipmentStatus)
      .attach('file', imgPath)
      .end(function (error: any, response: any) {
        if (error) done(error);
        expect(error).to.be.null;
        expect(response).to.have.status(HTTP_CREATED_CODE);
        done();
      });
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
          expect(response).to.have.status(HTTP_NOCONTENT_CODE);
          done();
        });
    });
  });

  it('Should Unsuccessfully Delete a Biomech Report Due to Invalid ID', function (done: Done) {
    agent
      .delete(`${BIOMECH_ENDPOINT}/${invalidId}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .end(function (error: any, response: any) {
        if (error) done(error);
        expect(response).to.have.status(HTTP_NOTFOUND_CODE);
        done();
      });
  });
});
