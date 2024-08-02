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

  it('Should Retrieve Form Template when Choosing Department Type', function () {
    cy.intercept('GET', `${serverUrl}/api/template/*`, {
      statusCode: 200,
    }).as('getReportTemplate');
    reportCreationPage.chooseDepartmentTypeDropdown();
    cy.wait('@getReportTemplate').then((intercept: Interception) => {
      expect(intercept.response?.statusCode).to.equal(200);
    });
  });

  it('Should Select a Month from the dropdown', function () {
    cy.get('[data-testid="month-select-dropdown"]').select(0);
    cy.get('[data-testid="month-select-dropdown"]')
      .find(':selected')
      .invoke('val')
      .should('not.be.empty');
  });

  it('Should Input a Valid Year', function () {
    const validYear = '2020';
    cy.get('[data-testid="year-select-dropdown"]').clear().type(validYear);
    cy.get('[data-testid="year-select-dropdown"]').should('have.value', validYear);
    cy.get('[data-testid="year-select-dropdown"]').should('not.have.class', 'is-invalid');
  });

  it('Should be Able to Switch Departments', function () {});
  it('Should Navigate to Different Pages', function () {});
  it('Should Warn of Pages not completed', function () {});
  it('Should Show Unsaved Changes Warning Pop-up when Leaving Page', function () {});
  it('Should Save Report as Draft', function () {});
});
