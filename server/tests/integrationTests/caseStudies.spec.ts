import http from 'http';
import {
  Accounts,
  closeServer,
  setUpSession,
  seedMongo,
  dropMongo,
  USER_ID,
  DEP_ID,
} from 'testTools/mochaHooks';
import { CASE_STUDIES_ENDPOINT, CASE_STUDIES_FEATURED_ENDPOINT } from 'testTools/endPoints';
import { Done } from 'mocha';
import { formatDateString } from 'utils/utils';
import {
  HTTP_INTERNALERROR_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_NOTFOUND_CODE,
  HTTP_OK_CODE,
} from 'exceptions/httpException';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import CaseStudy, { CaseStudyOptions } from 'models/caseStudies';

chai.use(chaiHttp);

let httpServer: http.Server;
let agent: any;
let csrf: string;

async function createEmptyCaseStudy(
  featured = false,
  userId: string = USER_ID.ADMIN,
  departmentId: string = DEP_ID.GENERAL,
) {
  let caseStudy = new CaseStudy({
    caseStudyType: CaseStudyOptions.PatientStory,
    userId: userId,
    departmentId: departmentId,
    imgPath: 'public/images/case1.jpg',
    featured: featured,
  });
  await caseStudy.save();
  return caseStudy.toObject();
}

async function createPatientStory(
  featured = false,
  userId: string = USER_ID.ADMIN,
  departmentId: string = DEP_ID.GENERAL,
) {
  const caseStudy = new CaseStudy({
    caseStudyType: CaseStudyOptions.PatientStory,
    userId: userId,
    departmentId: departmentId,
    imgPath: 'public/images/case1.jpg',
    featured: featured,
    patientStory: {
      patientsName: 'Jamie Doe',
      patientsAge: 24,
      whereIsThePatientFrom: 'Vancouver',
      whyComeToHcbh: 'Illness',
      howLongWereTheyAtHcbh: '1 week',
      diagnosis: 'Ill',
      caseStudyStory: 'Was ill but got better',
    },
  });
  await caseStudy.save();
  return caseStudy.toObject();
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
  });

  afterEach('clean up test data', async () => {
    await dropMongo();
  });

  it('Should Get Featured Case Study', async function () {
    const featureId = await createEmptyCaseStudy(true);
    createEmptyCaseStudy();

    const res = await agent.get(CASE_STUDIES_FEATURED_ENDPOINT);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('featured');
    expect(res.body.id!).to.be.equal(featureId._id.toString());
    expect(res.body.featured!).to.be.equal(true);
  });

  it('Should return no content code if no case study is featured', async function () {
    const res = await agent.get(CASE_STUDIES_FEATURED_ENDPOINT);

    expect(res).to.have.status(HTTP_NOCONTENT_CODE);
  });

  it('Should get all Case Studies, returning the featured one first', async function () {
    await createEmptyCaseStudy();
    const featureId = await createEmptyCaseStudy(true);
    await createEmptyCaseStudy(false, USER_ID.REGULAR, DEP_ID.MATERNITY);

    const res = await agent.get(CASE_STUDIES_ENDPOINT);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(3);
    expect(res.body[0].id!).to.be.equal(featureId._id.toString());
  });

  it('Should Successfully GET a case study via ID', async function () {
    const patientStory = await createPatientStory();
    await createEmptyCaseStudy();

    const res = await agent.get(`${CASE_STUDIES_ENDPOINT}/${patientStory._id}`);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(res.body.id).to.equal(patientStory._id.toString());
    expect(res.body.patientStory).to.deep.equal(patientStory.patientStory);
  });

  it('Should Unsuccesfully GET a case study via ID Due to Invalid Id', function (done: Done) {
    agent.get(`${CASE_STUDIES_ENDPOINT}/${'Invalid'}`).end(function (error: any, response: any) {
      if (error) done(error);
      expect(response).to.have.status(HTTP_INTERNALERROR_CODE);
      done();
    });
  });

  it('Should return a NOT_FOUND error when the id is for a case study that does not exist', function (done: Done) {
    const invalidId = '76687ef1366f942478fa3d80';
    agent.get(`${CASE_STUDIES_ENDPOINT}/${invalidId}`).end(function (error: any, response: any) {
      if (error) done(error);
      expect(response).to.have.status(HTTP_NOTFOUND_CODE);
      done();
    });
  });

  it('Should Successfully Post a New Case Patient Story', async function () {
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

    await agent
      .post(CASE_STUDIES_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .field('document', document)
      .attach('file', imgPath);

    let caseStudy = await CaseStudy.findOne({ 'patientStory.patientsName': 'John' }).lean();
    expect(caseStudy).to.not.be.null;
    expect(caseStudy!.caseStudyType).to.equal('Patient Story');
    expect(caseStudy!.patientStory).to.not.be.null;
    expect(caseStudy!.patientStory!.patientsName).to.equal('John');
    expect(caseStudy!.patientStory!.patientsAge).to.equal(22);
    expect(caseStudy!.patientStory!.whereIsThePatientFrom).to.equal('Canada');
    expect(caseStudy!.patientStory!.whyComeToHcbh).to.equal('Illness');
    expect(caseStudy!.patientStory!.howLongWereTheyAtHcbh).to.equal('3 years');
    expect(caseStudy!.patientStory!.diagnosis).to.equal('Flu');
    expect(caseStudy!.patientStory!.caseStudyStory).to.equal('John recovered!');
  });

  it('Should Successfully Post a New Staff Recognition Story', async function () {
    const imgPath: string = 'public/images/avatar1.jpg';
    const document: string = `{"staffRecognition":
      {"staffName":"John",
      "jobTitle":"Doctor",
      "department":"General",
      "howLongWorkingAtHcbh":"5 years",
      "mostEnjoy":"Working with patients",
      "caseStudyStory":"John is amazing!"},
      "caseStudyType":"Staff Recognition"}`;

    await agent
      .post(CASE_STUDIES_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .field('document', document)
      .attach('file', imgPath);

    let caseStudy = await CaseStudy.findOne({ 'staffRecognition.staffName': 'John' }).lean();

    expect(caseStudy).to.not.be.null;
    expect(caseStudy!.caseStudyType).to.equal('Staff Recognition');
    expect(caseStudy!.staffRecognition).to.not.be.null;
    expect(caseStudy!.staffRecognition!.staffName).to.equal('John');
    expect(caseStudy!.staffRecognition!.jobTitle).to.equal('Doctor');
    expect(caseStudy!.staffRecognition!.department).to.equal('General');
    expect(caseStudy!.staffRecognition!.howLongWorkingAtHcbh).to.equal('5 years');
    expect(caseStudy!.staffRecognition!.mostEnjoy).to.equal('Working with patients');
    expect(caseStudy!.staffRecognition!.caseStudyStory).to.equal('John is amazing!');
  });

  it('Should Successfully Post a New Training Session Story', async function () {
    const imgPath: string = 'public/images/avatar2.jpg';
    const document: string = `{"trainingSession":
      {"trainingDate":"01-01-2000",
      "trainingOn":"MRI",
      "whoConducted":"John",
      "whoAttended":"Seraphine",
      "benefitsFromTraining":"John is more knowledgeable now",
      "caseStudyStory":"A successful training session!"},
      "caseStudyType":"Training Session"}`;

    await agent
      .post(CASE_STUDIES_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .field('document', document)
      .attach('file', imgPath);

    let caseStudy = await CaseStudy.findOne({
      'trainingSession.trainingDate': '01-01-2000',
    }).lean();

    expect(caseStudy).to.not.be.null;
    expect(caseStudy!.caseStudyType).to.equal('Training Session');
    expect(caseStudy!.trainingSession).to.not.be.null;

    const trainingDate: Date = new Date(caseStudy!.trainingSession!.trainingDate);
    expect(formatDateString(trainingDate)).to.equal(`${formatDateString(new Date('01-01-2000'))}`);
    expect(caseStudy!.trainingSession!.trainingOn).to.equal('MRI');
    expect(caseStudy!.trainingSession!.whoConducted).to.equal('John');
    expect(caseStudy!.trainingSession!.whoAttended).to.equal('Seraphine');
    expect(caseStudy!.trainingSession!.benefitsFromTraining).to.equal(
      'John is more knowledgeable now',
    );
    expect(caseStudy!.trainingSession!.caseStudyStory).to.equal('A successful training session!');
  });

  it('Should Successfuly Post a new Equipment Received Case Study', async function () {
    const imgPath: string = 'public/images/avatar0.jpg';
    const document: string = `{"equipmentReceived":
      {"equipmentReceived":"MRI Machine",
      "departmentReceived":"General",
      "whoSentEquipment":"John",
      "purchasedOrDonated":"Donated",
      "whatDoesEquipmentDo":"Brain Imaging",
      "caseStudyStory":"Received a new MRI Machine"},
      "caseStudyType":"Equipment Received"}`;

    await agent
      .post(CASE_STUDIES_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .field('document', document)
      .attach('file', imgPath);

    let caseStudy = await CaseStudy.findOne({
      'equipmentReceived.equipmentReceived': 'MRI Machine',
    }).lean();

    expect(caseStudy).to.not.be.null;
    expect(caseStudy!.caseStudyType).to.equal('Equipment Received');
    expect(caseStudy!.equipmentReceived).to.not.be.null;
    expect(caseStudy!.equipmentReceived!.equipmentReceived).to.equal('MRI Machine');
    expect(caseStudy!.equipmentReceived!.departmentReceived).to.equal('General');
    expect(caseStudy!.equipmentReceived!.whoSentEquipment).to.equal('John');
    expect(caseStudy!.equipmentReceived!.purchasedOrDonated).to.equal('Donated');
    expect(caseStudy!.equipmentReceived!.whatDoesEquipmentDo).to.equal('Brain Imaging');
    expect(caseStudy!.equipmentReceived!.caseStudyStory).to.equal('Received a new MRI Machine');
  });

  it("Should Successfully Post an 'Other' Case Study", async function () {
    const imgPath: string = 'public/images/avatar1.jpg';
    const document: string = `{"otherStory":
      {"caseStudyStory":"This is a Story in the \'Other\' Category"},
      "caseStudyType":"Other Story"}`;

    await agent
      .post(CASE_STUDIES_ENDPOINT)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf })
      .field('document', document)
      .attach('file', imgPath);

    let caseStudy = await CaseStudy.findOne({
      'otherStory.caseStudyStory': "This is a Story in the 'Other' Category",
    }).lean();

    expect(caseStudy).to.not.be.null;
    expect(caseStudy!.caseStudyType).to.equal('Other Story');
    expect(caseStudy!.otherStory).to.not.be.null;
    expect(caseStudy!.otherStory!.caseStudyStory).to.equal(
      "This is a Story in the 'Other' Category",
    );
  });

  it('Should Successfully Delete a Case Study', async function () {
    const caseStudy = await createEmptyCaseStudy();
    const keepStudy = await createEmptyCaseStudy();

    const res = await agent
      .delete(`${CASE_STUDIES_ENDPOINT}/${caseStudy._id}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });

    expect(res).to.have.status(HTTP_NOCONTENT_CODE);
    expect(await CaseStudy.findById(caseStudy._id)).is.null;
    expect(await CaseStudy.findById(keepStudy._id)).is.not.empty;
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
    const caseStudy = await createEmptyCaseStudy();
    const wasFeatured = await createEmptyCaseStudy(true);

    const res = await agent
      .patch(`${CASE_STUDIES_ENDPOINT}/${caseStudy._id}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });

    const newFeatured = await CaseStudy.findById(caseStudy._id);
    const oldFeatured = await CaseStudy.findById(wasFeatured._id);

    expect(res).to.have.status(HTTP_OK_CODE);
    expect(newFeatured?.featured).to.be.true;
    expect(oldFeatured?.featured).to.be.false;
  });

  it('Should Successfully Retain the Featured Case Study (Changing it to the Same One)', async function () {
    const caseStudy = await createEmptyCaseStudy();
    const wasFeatured = await createEmptyCaseStudy(true);

    const res = await agent
      .patch(`${CASE_STUDIES_ENDPOINT}/${wasFeatured._id}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });

    const newFeatured = await CaseStudy.findById(caseStudy._id);
    const oldFeatured = await CaseStudy.findById(wasFeatured._id);

    expect(res).to.have.status(HTTP_NOCONTENT_CODE);
    expect(newFeatured?.featured).to.be.false;
    expect(oldFeatured?.featured).to.be.true;
  });

  it('Should Unsuccessfully Change the Featured Case Study Due To Invalid Id', async function () {
    const invalidId = '668c32807ab60b5a049a7adc';

    const res = await agent
      .patch(`${CASE_STUDIES_ENDPOINT}/${invalidId}`)
      .set({ 'Content-Type': 'application/json', 'CSRF-Token': csrf });

    expect(res).to.have.status(HTTP_NOTFOUND_CODE);
  });
});
