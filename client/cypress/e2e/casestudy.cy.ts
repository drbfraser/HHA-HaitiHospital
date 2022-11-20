/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import en from '../../src/locales/en/translationEN.json';
import { CaseStudyPage } from '../support/pages/CaseStudyPage';
import { CASE_STUDY_ADDED_SUCCESSFULLY } from '../support/constants/toasts';

describe('Case Study Tests', function () {
  const loginPage = new LoginPage();
  const caseStudyPage = new CaseStudyPage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;
  const baseUrl = Cypress.env('baseUrl');


  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();

    // Tests run too quickly---cy.visit() is not working without this delay
    cy.wait(100);
    caseStudyPage.visit();
  });

  it('Should Successfully Submit and View a Case Study', function () {
    caseStudyPage.clickAddCaseStudyButton();
    caseStudyPage.selectCaseStudyType('Patient Story');
    caseStudyPage.inputPatientName('John Doe');
    caseStudyPage.inputPatientAge('22');
    caseStudyPage.inputPatientFrom('Canada');
    caseStudyPage.inputPatientChoose('Great Service!');
    caseStudyPage.inputPatientHowLong('8 weeks');
    caseStudyPage.inputPatientDiagnosis('Pneumonia');
    caseStudyPage.inputPatientCaseStory('John Doe fully recovered!');
    caseStudyPage.uploadPatientFile('public/images/avatar0.jpg');
    caseStudyPage.checkConsentBox();
    caseStudyPage.clickSubmitCaseStudyButton();
    cy.url().should('equal', `${baseUrl}/case-study`);

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', CASE_STUDY_ADDED_SUCCESSFULLY);
    toast.click();

    caseStudyPage.clickViewCaseStudyButton();
    cy.url().should('include', '/case-study/view');

    cy.contains('[data-testid="case-study-patient-title"]', 'Patient Story Case Study');
    cy.contains('[data-testid="case-study-patient-name"]', 'John Doe');
    cy.contains('[data-testid="case-study-patient-age"]', '22');
    cy.contains('[data-testid="case-study-patient-from"]', 'Canada');
    cy.contains('[data-testid="case-study-patient-why-come"]', 'Great Service!');
    cy.contains('[data-testid="case-study-patient-how-long"]', '8 Weeks');
    cy.contains('[data-testid="case-study-patient-diagnosis"]', 'Pneumonia');
    cy.contains('[data-testid="case-study-patient-case-story"]', 'John Doe fully recovered!');
  });
});
