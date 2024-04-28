/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import { EOTMPage } from '../support/pages/EOTMPage';
import { ResponseMessage } from '../support/constants/response_message';

describe('Employee Of The Month Tests', function () {
  const loginPage = new LoginPage();
  const eotmPage = new EOTMPage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;
  const baseUrl = Cypress.env('baseUrl');

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
    eotmPage.visit();
  });

  it('Should Navigate Back to the EOTM Main', function () {
    eotmPage.clickAddEOTMButton();
    eotmPage.clickBackEOTMButton();
    cy.url().should('equal', `${baseUrl}/employee-of-the-month`);
  });

  it('Should Successfully Add EOTM', function () {
    const name: string = 'Brand New Squidward';
    const department: string = 'Rehab';
    const description: string = 'He is so handsome that we must crown him Employee Of The Month!';

    // for latest eotm
    const now = new Date();
    const awardDate = now.getFullYear().toString() + '-' + ('0' + (now.getMonth() + 1)).slice(-2);
    eotmPage.clickAddEOTMButton();
    cy.url().should('equal', `${baseUrl}/employee-of-the-month/add`);

    eotmPage.inputEmployeeName(name);
    eotmPage.selectDepartment(department);
    eotmPage.inputDescription(description);
    eotmPage.inputAwardDate(awardDate);
    eotmPage.uploadEmployeeImage('public/images/avatar0.jpg');
    cy.wait(100);
    eotmPage.clickSubmitEOTMButton();

    cy.url().should('equal', `${baseUrl}/employee-of-the-month`);

    cy.get('[id="employee-subcontainer"]').contains('p', name);
    cy.get('[id="employee-subcontainer"]').contains('p', department);
    cy.get('[id="employee-subcontainer"]').contains('p', description);
  });

  it('Should Successfully Edit EOTM Entry', function () {
    eotmPage.clickSeePastEOTMButton();
    cy.url().should('equal', `${baseUrl}/employee-of-the-month/archive`);
    eotmPage.clickEditEOTMButton(0);

    cy.url().should('match', /\/employee-of-the-month\/update\/[0-9a-fA-F]+/);

    eotmPage.inputEmployeeName('Brand New Squidward Edit');
    eotmPage.inputDescription(
      'He is so handsome AND TALENTED that we must crown him Employee Of The Month!',
    );
    eotmPage.inputAwardDate('2024-04');
    eotmPage.selectDepartment('Maternity');
    eotmPage.clickSubmitEOTMButton();

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', ResponseMessage.getMsgUpdateEotmOk());
    toast.click({ multiple: true });
  });

  it('Should Successfully Delete EOTM Entry', function () {
    eotmPage.clickSeePastEOTMButton();
    cy.url().should('equal', `${baseUrl}/employee-of-the-month/archive`);
    eotmPage.clickDeleteEOTM(0);
    eotmPage.clickDeleteEOTMConfirmButton();

    const successToast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    successToast.should('include.text', ResponseMessage.getMsgDeleteEotmOk());
    successToast.click();
  });
});

describe('User EOTM Tests', function () {
  const loginPage = new LoginPage();

  const username = Cypress.env('User').username;
  const password = Cypress.env('User').password;

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
  });

  it('Should Not Be Able to Change EOTM as User', function () {
    cy.get('[data-testid="add-eotm-button"]').should('not.exist');
  });
});
