import http from 'http';
import { Accounts, closeServer, setUpSession, seedMongo, dropMongo } from 'testTools/mochaHooks';
import { CASE_STUDIES_ENDPOINT, CASE_STUDIES_FEATURED_ENDPOINT } from 'testTools/endPoints';
import { Done } from 'mocha';
import { formatDateString } from 'utils/utils';
import {
  HTTP_CREATED_CODE,
  HTTP_INTERNALERROR_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_NOTFOUND_CODE,
  HTTP_OK_CODE,
} from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedCaseStudies } from 'seeders/seed';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import CaseStudy from 'models/caseStudies';

chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: string;

function postCaseStudy(
  document: string,
  imgPath: string,
  done: Done,
  expectedStatus: number,
  next?: Function,
) {
  agent
    .post(CASE_STUDIES_ENDPOINT)
    .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
    .field('document', document)
    .attach('file', imgPath)
    .end(function (error: Error, response: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(expectedStatus);
      if (!next) done();
      else next();
    });
}

describe('Case Study Tests', function () {
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
    await seedCaseStudies();
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('Should Get Featured Case Study', function (done: Done) {
    agent.get(CASE_STUDIES_FEATURED_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(HTTP_OK_CODE);
      done();
    });
  });

  it('Should Get All Case Studies', function (done: Done) {
    agent.get(CASE_STUDIES_ENDPOINT).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(HTTP_OK_CODE);
      done();
    });
  });

  it('Should Successfully GET a case study via ID', function (done: Done) {
    // Need to perform a GET to get a case Study's ID
    agent.get(CASE_STUDIES_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);

      const caseStudy = response.body[0];
      const id: string = caseStudy?.id;

      agent.get(`${CASE_STUDIES_ENDPOINT}/${id}`).end(function (error: any, response: any) {
        if (error) done(error);
        expect(response).to.have.status(HTTP_OK_CODE);

        const fetchedCaseStudy = response.body;
        expect(fetchedCaseStudy).to.deep.equal(caseStudy);
        done();
      });
    });
  });

  it('Should Unsuccesfully GET a case study via ID Due to Invalid Id', function (done: Done) {
    agent.get(`${CASE_STUDIES_ENDPOINT}/${'Invalid'}`).end(function (error: any, response: any) {
      if (error) done(error);
      expect(response).to.have.status(HTTP_INTERNALERROR_CODE);
      done();
    });
  });

  it('Should Successfully Post a New Case Patient Story', function (done: Done) {
    // just drop database for now to gurantee the response body only has one result
    CaseStudy.deleteMany({}).then(() => {
      const imgPath: string = 'public/images/avatar0.jpg';
      const document: string = `{"patientStory":
        {"patientsName":"John",
        "patientsAge":"22",
        "whereIsThePatientFrom":"Canada",
        "whyComeToHcbh":"Illness",
        "howLongWereTheyAtHcbh":"3 years",
        "diagnosis":"Flu",
        "caseStudyStory":"John recovered!"},
        "caseStudyType":"Patient Story"}`;

      postCaseStudy(document, imgPath, done, HTTP_CREATED_CODE, function () {
        // Verify that the correct information is stored

        agent.get(CASE_STUDIES_ENDPOINT).end(async function (error: any, response: any) {
          if (error) done(error);

          const caseStudy = response.body[1]; // Sorted in decesending order, so grab the first one that's not Favourited

          expect(caseStudy.caseStudyType).to.equal('Patient Story');
          expect(caseStudy.patientStory.patientsName).to.equal('John');
          expect(caseStudy.patientStory.patientsAge).to.equal(22);
          expect(caseStudy.patientStory.whereIsThePatientFrom).to.equal('Canada');
          expect(caseStudy.patientStory.whyComeToHcbh).to.equal('Illness');
          expect(caseStudy.patientStory.howLongWereTheyAtHcbh).to.equal('3 years');
          expect(caseStudy.patientStory.diagnosis).to.equal('Flu');
          expect(caseStudy.patientStory.caseStudyStory).to.equal('John recovered!');
          done();
        });
      });
    });
  });

  it('Should Successfully Post a New Staff Recognition Story', function (done: Done) {
    const imgPath: string = 'public/images/avatar1.jpg';
    const document: string = `{"staffRecognition":
      {"staffName":"John",
      "jobTitle":"Doctor",
      "department":"General",
      "howLongWorkingAtHcbh":"5 years",
      "mostEnjoy":"Working with patients",
      "caseStudyStory":"John is amazing!"},
      "caseStudyType":"Staff Recognition"}`;

    postCaseStudy(document, imgPath, done, HTTP_CREATED_CODE, function () {
      // Verify that the correct information is stored
      agent.get(CASE_STUDIES_ENDPOINT).end(function (error: any, response: any) {
        if (error) done(error);

        const caseStudy = response.body[1]; // Sorted in decesending order, so grab the first one

        expect(caseStudy.caseStudyType).to.equal('Staff Recognition');
        expect(caseStudy.staffRecognition.staffName).to.equal('John');
        expect(caseStudy.staffRecognition.jobTitle).to.equal('Doctor');
        expect(caseStudy.staffRecognition.department).to.equal('General');
        expect(caseStudy.staffRecognition.howLongWorkingAtHcbh).to.equal('5 years');
        expect(caseStudy.staffRecognition.mostEnjoy).to.equal('Working with patients');
        expect(caseStudy.staffRecognition.caseStudyStory).to.equal('John is amazing!');
        done();
      });
    });
  });

  it('Should Successfully Post a New Training Session Story', function (done: Done) {
    const imgPath: string = 'public/images/avatar2.jpg';
    const document: string = `{"trainingSession":
      {"trainingDate":"01-01-2000",
      "trainingOn":"MRI",
      "whoConducted":"John",
      "whoAttended":"Seraphine",
      "benefitsFromTraining":"John is more knowledgeable now",
      "caseStudyStory":"A successful training session!"},
      "caseStudyType":"Training Session"}`;

    postCaseStudy(document, imgPath, done, HTTP_CREATED_CODE, function () {
      // Verify that the correct information is stored
      agent.get(CASE_STUDIES_ENDPOINT).end(function (error: any, response: any) {
        if (error) done(error);

        const caseStudy = response.body[1]; // Sorted in decesending order, so grab the first one

        expect(caseStudy.caseStudyType).to.equal('Training Session');

        const trainingDate: Date = new Date(caseStudy.trainingSession.trainingDate);
        expect(formatDateString(trainingDate)).to.equal(
          `${formatDateString(new Date('01-01-2000'))}`,
        );
        expect(caseStudy.trainingSession.trainingOn).to.equal('MRI');
        expect(caseStudy.trainingSession.whoConducted).to.equal('John');
        expect(caseStudy.trainingSession.whoAttended).to.equal('Seraphine');
        expect(caseStudy.trainingSession.benefitsFromTraining).to.equal(
          'John is more knowledgeable now',
        );
        expect(caseStudy.trainingSession.caseStudyStory).to.equal('A successful training session!');
        done();
      });
    });
  });

  it('Should Successfuly Post a new Equipment Received Case Study', function (done: Done) {
    const imgPath: string = 'public/images/avatar0.jpg';
    const document: string = `{"equipmentReceived":
      {"equipmentReceived":"MRI Machine",
      "departmentReceived":"General",
      "whoSentEquipment":"John",
      "purchasedOrDonated":"Donated",
      "whatDoesEquipmentDo":"Brain Imaging",
      "caseStudyStory":"Received a new MRI Machine"},
      "caseStudyType":"Equipment Received"}`;

    postCaseStudy(document, imgPath, done, HTTP_CREATED_CODE, function () {
      // Verify that the correct information is stored
      agent.get(CASE_STUDIES_ENDPOINT).end(function (error: any, response: any) {
        if (error) done(error);

        const caseStudy = response.body[1]; // Sorted in decesending order, so grab the first one
        expect(caseStudy.caseStudyType).to.equal('Equipment Received');
        expect(caseStudy.equipmentReceived.equipmentReceived).to.equal('MRI Machine');
        expect(caseStudy.equipmentReceived.departmentReceived).to.equal('General');
        expect(caseStudy.equipmentReceived.whoSentEquipment).to.equal('John');
        expect(caseStudy.equipmentReceived.purchasedOrDonated).to.equal('Donated');
        expect(caseStudy.equipmentReceived.whatDoesEquipmentDo).to.equal('Brain Imaging');
        expect(caseStudy.equipmentReceived.caseStudyStory).to.equal('Received a new MRI Machine');
        done();
      });
    });
  });

  it("Should Successfully Post an 'Other' Case Study", function (done: Done) {
    const imgPath: string = 'public/images/avatar1.jpg';
    const document: string = `{"otherStory":
      {"caseStudyStory":"This is a Story in the \'Other\' Category"},
      "caseStudyType":"Other Story"}`;

    postCaseStudy(document, imgPath, done, HTTP_CREATED_CODE, function () {
      // Verify that the correct information is stored
      agent.get(CASE_STUDIES_ENDPOINT).end(function (error: any, response: any) {
        if (error) done(error);

        const caseStudy = response.body[1]; // Sorted in decesending order, so grab the first one
        expect(caseStudy.caseStudyType).to.equal('Other Story');
        expect(caseStudy.otherStory.caseStudyStory).to.equal(
          "This is a Story in the 'Other' Category",
        );
        done();
      });
    });
  });

  it('Should Successfully Delete a Case Study', function (done) {
    // Need to perform a GET to get a case Study's ID
    agent.get(CASE_STUDIES_ENDPOINT).end(function (error: Error, response: any) {
      if (error) done(error);

      const caseStudy = response.body[1];
      const id: string = caseStudy?.id;

      agent
        .delete(`${CASE_STUDIES_ENDPOINT}/${id}`)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .end(function (error: Error, response: any) {
          if (error) done(error);
          expect(response).to.have.status(HTTP_NOCONTENT_CODE);
          // caseStudyIds = caseStudyIds.filter((caseStudyId) => caseStudyId !== id);

          // Check that the case study is no longer in the database
          agent.get(`${CASE_STUDIES_ENDPOINT}/${id}`).end(function (error: Error, response: any) {
            if (error) done(error);

            expect(response).to.have.status(HTTP_NOTFOUND_CODE);
            done();
          });
        });
    });
  });

  it('Should Unsuccessfully Delete a Case Study due to Invalid ID', function (done) {
    agent
      .delete(`${CASE_STUDIES_ENDPOINT}/${'Invalid ID'}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .end(function (error: Error, response: any) {
        if (error) done(error);
        expect(response).to.have.status(HTTP_INTERNALERROR_CODE);
        done();
      });
  });

  it('Should Successfully Change the Featured Case Study', async function () {
    const getResponse = await agent.get(CASE_STUDIES_ENDPOINT);

    // Selecting the last one because new case studies created for the sake of testing are discarded after
    // If the first one was used, then running the test suite a second time would fail previous tests because the featured case study was deleted
    const caseStudy = getResponse.body[getResponse.body.length - 1];
    const id: string = caseStudy?.id;

    const putResponse = await agent
      .patch(`${CASE_STUDIES_ENDPOINT}/${id}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });
    caseStudy.featured
      ? expect(putResponse).to.have.status(HTTP_NOCONTENT_CODE)
      : expect(putResponse).to.have.status(HTTP_OK_CODE);

    // Check that the featured case study is updated
    const checkResponse = await agent.get(`${CASE_STUDIES_ENDPOINT}/${id}`);
    expect(checkResponse).to.have.status(HTTP_OK_CODE);
    expect(checkResponse.body.featured).to.be.true;
  });

  it('Should Successfully Retain the Featured Case Study (Changing it to the Same One)', function (done: Done) {
    agent.get(CASE_STUDIES_FEATURED_ENDPOINT).end(function (error: any, response: any) {
      if (error) done(error);
      const id: string = response.body.id;

      agent
        .patch(`${CASE_STUDIES_ENDPOINT}/${id}`)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .end(function (error: Error, response: any) {
          if (error) done(error);
          expect(response).to.have.status(HTTP_NOCONTENT_CODE);
          done();
        });
    });
  });

  it('Should Unsuccessfully Change the Featured Case Study Due To Invalid Id', function (done: Done) {
    agent
      .patch(`${CASE_STUDIES_ENDPOINT}/${'Invalid Id'}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .end(function (error: Error, response: any) {
        if (error) done(error);
        expect(response).to.have.status(HTTP_INTERNALERROR_CODE);
        done();
      });
  });
});
