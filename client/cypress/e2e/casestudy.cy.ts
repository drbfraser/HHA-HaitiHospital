/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import { CaseStudyPage } from '../support/pages/CaseStudyPage';
import { HeaderComponent } from '../support/components/Header';
import { ResponseMessage } from '../support/constants/response_message';

describe('Case Study Tests', function () {
  const loginPage = new LoginPage();
  const caseStudyPage = new CaseStudyPage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;
  const baseUrl = Cypress.env('baseUrl');
  const serverUrl = Cypress.env('serverUrl');

  let caseStudyIds: Array<string>;

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    caseStudyIds = new Array();
    cy.url().should('include', '/home');

    caseStudyPage.visit();
  });

  after(async function () {
    // Delete New Case Studies to Remove Photos Added to the Database During Testing
    for await (const caseStudyId of caseStudyIds) {
      cy.intercept('DELETE', `${serverUrl}/api/case-studies/${caseStudyId}`);
    }
  });

  it('Should Successfully Submit and View a Case Study', function () {
    caseStudyPage.clickAddCaseStudyButton();
    caseStudyPage.selectCaseStudyType('Patient Story');
    caseStudyPage.inputPatientName('John Doe');
    caseStudyPage.inputPatientAge('22');
    caseStudyPage.inputPatientFrom('Canada');
    caseStudyPage.inputPatientChoose('Great Service!');
    caseStudyPage.inputPatientHowLong('8 Weeks');
    caseStudyPage.inputPatientDiagnosis('Pneumonia');
    caseStudyPage.inputPatientCaseStory('John Doe fully recovered!');
    caseStudyPage.uploadPatientFile('public/images/avatar0.jpg');
    caseStudyPage.checkConsentBox();
    caseStudyPage.clickSubmitCaseStudyButton();
    cy.url().should('equal', `${baseUrl}/case-study`);

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', ResponseMessage.getMsgCreateCaseStudyOk());
    toast.click();

    caseStudyPage.clickViewCaseStudyButton(1);
    cy.url().should('include', '/case-study/view');
    cy.url().then(function (url) {
      const caseStudyId: string = url.split('/')[3];
      caseStudyIds.push(caseStudyId); // Store the Id of the Case Study for Deleting later
    });

    cy.contains('[data-testid="case-study-patient-name"]', 'John Doe');
    cy.contains('[data-testid="case-study-patient-age"]', '22');
    cy.contains('[data-testid="case-study-patient-from"]', 'Canada');
    cy.contains('[data-testid="case-study-patient-why-come"]', 'Great Service!');
    cy.contains('[data-testid="case-study-patient-how-long"]', '8 Weeks');
    cy.contains('[data-testid="case-study-patient-diagnosis"]', 'Pneumonia');
    cy.contains('[data-testid="case-study-patient-case-story"]', 'John Doe fully recovered!');
  });

  it('Should Successfully Delete a Case Study', function () {
    caseStudyPage.clickDeleteCaseStudyButton(1);
    caseStudyPage.clickDeleteCaseStudyConfirmButton();

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', ResponseMessage.getMsgDeleteCaseStudyOk());
    toast.click();
  });

  it('Should Successfully Feature a New Case Study', function () {
    caseStudyPage.clickFeatureCaseStudyButton(1);

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', ResponseMessage.getMsgFeatureCaseStudyOk());
    toast.click();
  });

  it('Should Unsuccesfully Delete the Current Case Study Because It is Featured', function () {
    caseStudyPage.clickDeleteCaseStudyButton(0);
    cy.get('[data-testid="reminder-to-change-featured-before-deleting"]').should('be.visible');
  });
});
