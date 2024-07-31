/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import { GeneralReportPage } from '../support/pages/GeneralReportPage';
import * as process from 'node:process';
import { Interception } from 'cypress/types/net-stubbing';

describe('General Report Page Tests', function () {
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

  describe('Navigation Tests', function () {
    it('Should Successfully Navigate to the Report Page', function () {
      generalReportPage.clickCreateNewReport();
      cy.url().should('equal', `${baseUrl}/report`);
    });
  });

  describe('Search and View Tests', function () {
    it('Should Successfully Search a Report', function () {
      generalReportPage.clickSearchReportTextField();
      generalReportPage.typeSearchReportTextField('rehab');
      cy.get('tbody tr').first().find('td').first().should('include.text', 'Rehab');
    });

    it('Should Successfully View a Report', function () {
      generalReportPage.clickIndividualReport();
      cy.url().should('match', new RegExp(`^${baseUrl}/report-view/[^/]+$`));
      generalReportPage.visit();
      generalReportPage.clickEditReport();
      cy.url().should('match', new RegExp(`^${baseUrl}/report-view/[^/]+$`));
    });
  });

  describe('Update Report Tests', function () {
    beforeEach(() => {
      cy.intercept('PUT', `${serverUrl}/api/report`, {
        statusCode: 200,
      }).as('updateReport');
    });

    it('Should Successfully Update Report Form', function () {
      generalReportPage.clickEditReport();
      generalReportPage.clickEditFormButton();
      generalReportPage.clickUpdateButton();
      generalReportPage.clickConfirmationModalCancelButton();
      generalReportPage.clickUpdateButton();
      generalReportPage.clickConfirmationModalConfirmButton();

      cy.wait('@updateReport').then((intercept: Interception) => {
        expect(intercept.response?.statusCode).to.equal(200);
      });
    });

    it('Should Save Report as Draft', function () {
      generalReportPage.clickEditReport();
      generalReportPage.clickEditFormButton();
      generalReportPage.clickSaveAsDraftButton();
      generalReportPage.clickConfirmationModalConfirmButton();

      cy.wait('@updateReport').then((intercept: Interception) => {
        expect(intercept.response?.statusCode).to.equal(200);
      });
    });

    it('Should Successfully Update Report Month', function () {
      generalReportPage.clickEditReport();
      generalReportPage.clickEditMonthButton();
      generalReportPage.clickApplyChangesButton();
      generalReportPage.clickConfirmationModalConfirmButton();

      cy.wait('@updateReport').then((intercept: Interception) => {
        expect(intercept.response?.statusCode).to.equal(200);
      });
    });
  });

  describe('Download Report Tests', function () {
    let downloadedFileName: string;
    it('Should Successfully Download Excel File', function () {
      generalReportPage.clickEditReport();
      generalReportPage.clickDownloadExcelButton();
      cy.task('getDownloadedFiles', 'cypress/downloads').then((files) => {
        expect((files as string[]).length).to.be.greaterThan(0);
        downloadedFileName = (files as string[])[0]; // Assuming the downloaded file is the first one
      });
    });
    after(() => {
      if (downloadedFileName) {
        cy.task('deleteFile', `cypress/downloads/${downloadedFileName}`);
      }
    });
  });
});
