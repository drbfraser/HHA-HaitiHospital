/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import { EOTMPage } from '../support/pages/EOTMPage';
import { EOTM_UPDATED_SUCCESSFULLY } from '../support/constants/toasts';

describe('Employee Of The Month Tests', function () {
  const loginPage = new LoginPage();
  const eotmPage = new EOTMPage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;
  const baseUrl = Cypress.env('baseUrl');

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();

    // Tests run too quickly---cy.visit() is not working without this delay
    cy.wait(100);
    eotmPage.visit();
  });

  it('Should Navigate Back to the EOTM Main', function () {
    eotmPage.clickUpdateEOTMButton();
    eotmPage.clickBackEOTMButton();
    cy.url().should('equal', `${baseUrl}/employee-of-the-month`);
  });

  it('Should Successfully Update EOTM', function () {
    const name: string = 'Handsome Squidward';
    const department: string = 'Rehab';
    const description: string = 'He is so handsome that we must crown him Employee Of The Month!';

    eotmPage.clickUpdateEOTMButton();
    cy.url().should('equal', `${baseUrl}/employee-of-the-month/form`);

    eotmPage.inputEmployeeName(name);
    eotmPage.selectDepartment(department);
    eotmPage.inputDescription(description);
    eotmPage.uploadEmployeeImage('public/images/avatar0.jpg');
    cy.wait(100);
    eotmPage.clickSubmitEOTMButton();

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', EOTM_UPDATED_SUCCESSFULLY);
    toast.click();

    cy.url().should('equal', `${baseUrl}/employee-of-the-month`);

    cy.get('div.employee-subcontainer').contains('p', name);
    cy.get('div.employee-subcontainer').contains('p', department);
    cy.get('div.employee-subcontainer').contains('p', description);
  });

  it('Should Unsuccessfully Update EOTM Due to Missing Image', function () {
    const name: string = 'Handsome Squidward';
    const department: string = 'Rehab';
    const description: string = 'He is so handsome that we must crown him Employee Of The Month!';

    eotmPage.clickUpdateEOTMButton();
    cy.url().should('equal', `${baseUrl}/employee-of-the-month/form`);

    eotmPage.inputEmployeeName(name);
    eotmPage.selectDepartment(department);
    eotmPage.inputDescription(description);

    eotmPage.clickSubmitEOTMButton();
    cy.url().should('equal', `${baseUrl}/employee-of-the-month/form`);
  });
});

describe('User EOTM Tests', function () {
  const loginPage = new LoginPage();
  const eotmPage = new EOTMPage();

  const username = Cypress.env('User').username;
  const password = Cypress.env('User').password;

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();
    cy.url().should('include', '/home');
  });

  it('Should Not Be Able to Change EOTM as User', function () {
    cy.get('[data-testid="update-eotm-button"]').should('not.exist');
  });
});
