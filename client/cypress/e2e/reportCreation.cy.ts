/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import { Interception } from 'cypress/types/net-stubbing';
import { ReportCreationPage } from '../support/pages/ReportCreationPage';

describe('Report Creation Tests', function () {
  const loginPage = new LoginPage();
  const reportCreationPage = new ReportCreationPage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;
  const serverUrl = Cypress.env('serverUrl');
  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');

    reportCreationPage.visit();
    cy.url().should('include', '/report');
  });

  describe('Select Department, Month, and Year Tests', function () {
    it('Should Retrieve Form Template when Choosing Department Type', function () {
      cy.intercept('GET', `${serverUrl}/api/template/*`).as('getReportTemplate');
      reportCreationPage.chooseDepartmentTypeDropdown();
      cy.wait('@getReportTemplate').then((intercept: Interception) => {
        expect(intercept.response?.statusCode).to.equal(200);
      });
    });

    it('Should Select a Month from the dropdown', function () {
      reportCreationPage.selectMonthDropdown();
      cy.get('[data-testid="month-select-dropdown"]')
        .find(':selected')
        .invoke('val')
        .should('not.be.empty');
    });

    it('Should Input a Valid Year', function () {
      const validyear = '2020';
      reportCreationPage.selectYearDropdown(validyear);
      cy.get('[data-testid="year-select-dropdown"]').should('have.value', validyear);
      cy.get('[data-testid="year-select-dropdown"]').should('not.have.class', 'is-invalid');
    });
  });

  describe('Report Form Tests', function () {
    beforeEach('Choosing Department and Mocking Report Template', function () {
      reportCreationPage.chooseDepartmentTypeDropdown();
      reportCreationPage.selectMonthDropdown();
      reportCreationPage.selectYearDropdown('2020');
      reportCreationPage.clickNextButton();
    });
    it('Should be Able to Switch Departments', function () {
      reportCreationPage.chooseDifferentDepartmentButton();
      reportCreationPage.chooseDepartmentTypeDropdown();
    });

    it('Should Warn of Pages not completed', function () {
      cy.get('[data-testid="submit-tooltip-warning"]').should('contain', 'Page(s) not completed');
    });
    it('Should Show Unsaved Changes Warning Pop-up when Leaving Page', function () {
      reportCreationPage.typeFormField();
      reportCreationPage.chooseDifferentDepartmentButton();
      cy.get('[data-testid="discard-submission-modal"]').should('contain', 'Discard Submission?');
    });
    it('Should Save Report as Draft', function () {
      cy.intercept('POST', `${serverUrl}/api/report`).as('createReportDraft');
      reportCreationPage.clickSaveAsDraftButton();
      reportCreationPage.clickConfirmationModalConfirmButton();
      cy.wait('@createReportDraft').then((intercept: Interception) => {
        expect(intercept.request.body.isDraft).to.equal(true);
        expect(intercept.response?.statusCode).to.equal(201);
        expect(intercept.response?.body).to.have.property('message', 'Report saved');
      });
    });
    // it('Should Submit a Report', function () {
    //   cy.intercept('POST', `${serverUrl}/api/report`, (req) => {
    //     expect(req.body.isDraft).to.equal(false);
    //     expect(req.body.serializedReport.questionItems[0].answer).to.equal(2);
    //     expect(req.body.serializedReport.questionItems[1].answer).to.equal(2);
    //     req.reply({
    //       statusCode: 201,
    //       body: {
    //         message: 'Report created successfully',
    //       },
    //     });
    //   }).as('createReport');
    //   reportCreationPage.typeFormField();
    //   reportCreationPage.clickSubmitButton();
    //   reportCreationPage.clickConfirmationModalConfirmButton();
    //   cy.wait('@createReport').then((intercept: Interception) => {
    //     expect(intercept.response?.statusCode).to.equal(201);
    //   });
    // });
  });
});
