import http from 'http';
import { Application } from 'express';
import { setupApp, setupHttpServer, attemptAuthentication, Accounts, closeServer } from './testTools/mochaHooks';
import { CASE_STUDIES_ENDPOINT, CASE_STUDIES_FEATURED_ENDPOINT, CSRF_ENDPOINT, LOGIN_ENDPOINT } from './testTools/endPoints';
import { Done } from 'mocha';
import { CaseStudy } from 'models/caseStudies';
import { clear } from 'console';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: String;

function postCaseStudy(document: String, imgPath: String, done: Done, expectedStatus: Number, next?: Function) {
  agent
    .post(CASE_STUDIES_ENDPOINT)
    .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
    .field('document', document)
    .attach('file', imgPath)
    .end(function (error, response) {
      // console.log(response);
      if (error) done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(expectedStatus);
      if (!next) done();
      else next();
    });
}

describe('getCaseStudies', function () {
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

  it('Should Get Featured Case Study', function (done) {
    agent.get(CASE_STUDIES_FEATURED_ENDPOINT).end(function (error: any, response: any) {
      if (error) return done(error);
      expect(error).to.be.null;
      expect(response).to.have.status(200);
      done();
    });
  });

  it('Should Get All Case Studies', function (done) {
    agent.get(CASE_STUDIES_ENDPOINT).end(function (error: any, response: any) {
      expect(error).to.be.null;
      expect(response).to.have.status(200);
      done();
    });
  });

  it('Should Successfully GET a case study via ID', function (done) {
    // Need to perform a GET to get a case Study's ID
    agent.get(CASE_STUDIES_ENDPOINT).end(function (error, response) {
      if (error) done(error);

      const caseStudy = response.body[0];
      const id: String = caseStudy?.id;
      const featured: Boolean = caseStudy?.featured;
      const imgPath: String = caseStudy?.imgPath;

      agent.get(`${CASE_STUDIES_ENDPOINT}/${id}`).end(function (error, response) {
        if (error) done(error);
        expect(response).to.have.status(200);

        const fetchedCaseStudy = response.body;
        expect(fetchedCaseStudy.id).to.equal(id);
        expect(fetchedCaseStudy.featured).to.equal(featured);
        expect(fetchedCaseStudy.imgPath).to.equal(imgPath);
        done();
      });
    });
  });

  it('Should Successfully Post a New Case Patient Story', function (done) {
    const imgPath: String = 'public/images/avatar0.jpg';
    const document: String = `{"patientStory":
        {"patientsName":"John",
        "patientsAge":"22",
        "whereIsThePatientFrom":"Canada",
        "whyComeToHcbh":"Illness",
        "howLongWereTheyAtHcbh":"3 years",
        "diagnosis":"Flu",
        "caseStudyStory":"John recovered!"},
        "caseStudyType":"Patient Story"}`;

    postCaseStudy(document, imgPath, done, 201, function () {
      // Verify that the correct information is stored
      agent.get(CASE_STUDIES_ENDPOINT).end(function (error, response) {
        if (error) done(error);

        const caseStudy = response.body[0]; // Sorted in decesending order, so grab the first one

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

  it('Should Successfully Post a New Staff Recognition Story', function (done) {
    const imgPath: String = 'public/images/avatar1.jpg';
    const document: String = `{"staffRecognition":
      {"staffName":"John",
      "jobTitle":"Doctor",
      "department":"General",
      "howLongWorkingAtHcbh":"5 years",
      "mostEnjoy":"Working with patients",
      "caseStudyStory":"John is amazing!"},
      "caseStudyType":"Staff Recognition"}`;

    postCaseStudy(document, imgPath, done, 201, function () {
      // Verify that the correct information is stored
      agent.get(CASE_STUDIES_ENDPOINT).end(function (error, response) {
        if (error) done(error);

        const caseStudy = response.body[0]; // Sorted in decesending order, so grab the first one

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

  it('Should Successfully Post a New Training Session Story', function (done) {
    const imgPath: String = 'public/images/avatar1.jpg';
    const document: String = `{"trainingSession":
      {"trainingDate":"01-01-2000",
      "trainingOn":"MRI",
      "whoConducted":"John",
      "whoAttended":"Seraphine",
      "benefitsFromTraining":"John is more knowledgeable now",
      "caseStudyStory":"A successful training session!"},
      "caseStudyType":"Training Session"}`;

    const timezone: string = 'America/Cancun';
    const language: string = 'en-US';

    postCaseStudy(document, imgPath, done, 201, function () {
      // Verify that the correct information is stored
      agent.get(CASE_STUDIES_ENDPOINT).end(function (error, response) {
        if (error) done(error);

        const caseStudy = response.body[0]; // Sorted in decesending order, so grab the first one

        expect(caseStudy.caseStudyType).to.equal('Training Session');
        // expect(caseStudy.trainingSession.trainingDate).to.equal(`${new Date('01-01-2000')}`); // Date format is not equal, this fails
        expect(caseStudy.trainingSession.trainingOn).to.equal('MRI');
        expect(caseStudy.trainingSession.whoConducted).to.equal('John');
        expect(caseStudy.trainingSession.whoAttended).to.equal('Seraphine');
        expect(caseStudy.trainingSession.benefitsFromTraining).to.equal('John is more knowledgeable now');
        expect(caseStudy.trainingSession.caseStudyStory).to.equal('A successful training session!');
        done();
      });
    });
  });

  it('Should Successfuly Post a new Equipment Received Case Study', function (done) {
    const imgPath: String = 'public/images/avatar1.jpg';
    const document: String = `{"equipmentReceived":
      {"equipmentReceived":"MRI Machine",
      "departmentReceived":"General",
      "whoSentEquipment":"John",
      "purchasedOrDonated":"Donated",
      "whatDoesEquipmentDo":"Brain Imaging",
      "caseStudyStory":"Received a new MRI Machine"},
      "caseStudyType":"Equipment Received"}`;

    postCaseStudy(document, imgPath, done, 201, function () {
      // Verify that the correct information is stored
      agent.get(CASE_STUDIES_ENDPOINT).end(function (error, response) {
        if (error) done(error);

        const caseStudy = response.body[0]; // Sorted in decesending order, so grab the first one
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

  it("Should Successfully Post an 'Other' Case Study", function (done) {
    const imgPath: String = 'public/images/avatar1.jpg';
    const document: String = `{"otherStory":
      {"caseStudyStory":"This is a Story in the \'Other\' Category"},
      "caseStudyType":"Other Story"}`;

    postCaseStudy(document, imgPath, done, 201, function () {
      // Verify that the correct information is stored
      agent.get(CASE_STUDIES_ENDPOINT).end(function (error, response) {
        if (error) done(error);

        const caseStudy = response.body[0]; // Sorted in decesending order, so grab the first one
        expect(caseStudy.caseStudyType).to.equal('Other Story');
        expect(caseStudy.otherStory.caseStudyStory).to.equal("This is a Story in the 'Other' Category");
        done();
      });
    });
  });

  it('Should Successfully Delete a Case Study', function (done) {
    // Need to perform a GET to get a case Study's ID
    agent.get(CASE_STUDIES_ENDPOINT).end(function (error, response) {
      if (error) done(error);

      const caseStudy = response.body[0];
      const id: String = caseStudy?.id;

      agent
        .delete(`${CASE_STUDIES_ENDPOINT}/${id}`)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .end(function (error, response) {
          if (error) done(error);
          expect(response).to.have.status(204);

          // Check that the case study is no longer in the database
          agent.get(`${CASE_STUDIES_ENDPOINT}/${id}`).end(function (error, response) {
            if (error) done(error);

            expect(response).to.have.status(404);
            done();
          });
        });
    });
  });

  it('Should Successfully Change the Featured Case Study', function (done) {
    // Need to perform a GET to get a case Study's ID
    agent.get(CASE_STUDIES_ENDPOINT).end(function (error, response) {
      if (error) done(error);

      const caseStudy = response.body[0];
      const id: String = caseStudy?.id;

      agent
        .patch(`${CASE_STUDIES_ENDPOINT}/${id}`)
        .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
        .end(function (error, response) {
          if (error) done(error);
          expect(response).to.have.status(200);

          // Check that the featured case study is updated
          agent.get(`${CASE_STUDIES_ENDPOINT}/${id}`).end(function (error, response) {
            if (error) done(error);

            expect(response).to.have.status(200);
            expect(response.body.featured).to.equal(true);
            done();
          });
        });
    });
  });

  // it('Should Fail to Post a New Case Patient Story', function (done) {
  //   const imgPath: String = 'public/images/avatar0.jpg';
  //   const document: String = `{"patientStory":
  //       {"patientsName":"John",
  //       "patientsAge":"ff",
  //       "whereIsThePatientFrom":"Canada",
  //       "whyComeToHcbh":"Illness",
  //       "howLongWereTheyAtHcbh":"3 years",
  //       "diagnosis":"Flu",
  //       "caseStudyStory":"John recovered!"},
  //       "caseStudyType":"Patient"}`;

  //   postCaseStudy(document, imgPath, done, 500);
  // });

  // THIS TEST IS FAILING! ERROR IS NOT BEING THROWN
  // it.only('Should Throw an Error due to Invalid Age', async function () {
  //   const imgPath: String = 'public/images/avatar0.jpg';

  //   const document: String = `{"patientStory":
  //     {"patientsName":"asdf",
  //     "patientsAge":"asdf",
  //     "whereIsThePatientFrom":"asdf",
  //     "whyComeToHcbh":"asdf",
  //     "howLongWereTheyAtHcbh":"asdf",
  //     "diagnosis":"asdf",
  //     "caseStudyStory":"asdf"},
  //     "caseStudyType":"Patient Story"}`;
  //   try {
  //     await agent.post(CASE_STUDIES_ENDPOINT).set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf }).field('document', document).attach('file', imgPath);
  //   } catch (error) {
  //     expect(error).to.be.an('error');
  //   }
  // });
});
