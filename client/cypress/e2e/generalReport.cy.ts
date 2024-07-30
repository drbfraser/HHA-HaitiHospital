/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import { GeneralReportPage } from '../support/pages/GeneralReportPage';
import * as process from 'node:process';
describe('General Report Tests', function () {
  const loginPage = new LoginPage();
  const generalReportPage = new GeneralReportPage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;
  const baseUrl = Cypress.env('baseUrl');
  const serverUrl = Cypress.env('serverUrl');

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');

    generalReportPage.visit();
  });

  // it('Should Successfully Navigate to the Report Page', function () {
  //   generalReportPage.clickCreateNewReport();
  //   cy.url().should('equal', `${baseUrl}/report`);
  // });
  //
  // it('Should Successfully Search a Report', function () {
  //   generalReportPage.clickSearchReportTextField();
  //   generalReportPage.typeSearchReportTextField('rehab');
  //   cy.get('tbody tr').first().find('td').first().should('include.text', 'Rehab');
  // });
  //
  // it('Should Successfully View a Report', function () {
  //   generalReportPage.clickIndividualReport();
  //   cy.url().should('match', new RegExp(`^${baseUrl}/report-view/[^/]+$`));
  //   generalReportPage.visit();
  //   generalReportPage.clickEditReport();
  //   cy.url().should('match', new RegExp(`^${baseUrl}/report-view/[^/]+$`));
  // });

  it('Should Successfully Edit a Report', function () {
    cy.intercept('PUT', `${serverUrl}/api/report`).as('putRequest');
    generalReportPage.clickEditReport();
    generalReportPage.clickEditFormButton();
    generalReportPage.clickUpdateButton();
    generalReportPage.clickConfirmationModalCancelButton();
    generalReportPage.clickUpdateButton();
    generalReportPage.clickConfirmationModalConfirmButton();
    // click edit form and edit month
    // save as draft or update
  });

  it('Should Successfully Download Excel File', function () {
    // click download excel
  });

  it('Should Successfully Hide and Show table', function () {});
  it('Should Successfully Delete a Report', function () {});
});
