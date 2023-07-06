/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import {
  BIO_MECH_ADDED_SUCCESSFULLY,
  BIO_MECH_DELETED_SUCCESSFULLY,
} from '../support/constants/toasts';
import { BioMechPage } from '../support/pages/BioMechPage';

describe('Bio Mech Tests', function () {
  enum BiomechPriority {
    URGENT = 'Urgent',
    IMPORTANT = 'Important',
    NONURGENT = 'Non-Urgent',
  }

  enum BiomechStatus {
    FIXED = 'Fixed',
    INPROGRESS = 'In-progress',
    BACKLOG = 'Backlog',
  }

  const loginPage = new LoginPage();
  const bioMechPage = new BioMechPage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;
  const baseUrl = Cypress.env('baseUrl');
  const serverUrl = Cypress.env('serverUrl');

  let bioMechIds: Array<string>;

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
    bioMechIds = new Array();

    // Tests run too quickly---cy.visit() is not working without this delay
    cy.wait(200);
    bioMechPage.visit();
  });

  after(async function () {
    // Delete New Bio Mech to Remove Photos Added to the Database During Testing
    for await (const bioMechId of bioMechIds) {
      cy.intercept('DELETE', `${serverUrl}/api/biomechanic/${bioMechId}`);
    }
  });

  it('Should Successfully Navigate Back to the Main Bio Mech Report Page', function () {
    bioMechPage.clickAddBioMechReportButton();
    cy.url().should('equal', `${baseUrl}/biomechanic/report-broken-kit`);
    bioMechPage.clickBackAddBioMechReportButton();
    cy.url().should('equal', `${baseUrl}/biomechanic`);
  });

  it('Should Successfully Submit and View a Bio Mechanic Report', function () {
    bioMechPage.clickAddBioMechReportButton();
    cy.url().should('equal', `${baseUrl}/biomechanic/report-broken-kit`);

    bioMechPage.inputEquipmentName('X-ray');
    bioMechPage.inputEquipmentIssue('It is not functioning!');
    bioMechPage.selectEquipmentPriority(BiomechPriority.URGENT);
    bioMechPage.selectEquipmentStatus(BiomechStatus.BACKLOG);
    bioMechPage.uploadEquipmentFile('public/images/avatar0.jpg');
    cy.wait(1000); // Will not work without a pause
    bioMechPage.clickSubmitBioMechReportButton();
    cy.url().should('equal', `${baseUrl}/biomechanic`);

    bioMechPage.clickViewBioMechReportButton(0);
    cy.url().should('include', '/biomechanic/view');
    cy.url().then(function (url) {
      const bioMechId: string = url.split('/')[3];
      bioMechIds.push(bioMechId); // Store the Id of the Bio Mech Report to Delete Later
    });

    // Check that fields are properly set
    cy.get('[data-testid="biomech-title"]').contains('Broken Kit Report');
    cy.get('[data-testid="biomech-equipment-name"]').contains('X-ray');
    cy.get('[data-testid="biomech-priority"]').contains(BiomechPriority.URGENT);
    cy.get('[data-testid="biomech-equipment-status"]').contains(BiomechStatus.BACKLOG);
    cy.get('[data-testid="biomech-issue"]').contains('It is not functioning!');

    bioMechPage.clickBackViewBioMechReportButton();
    cy.url().should('equal', `${baseUrl}/biomechanic`);

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', BIO_MECH_ADDED_SUCCESSFULLY);
  });

  it('Should Successfully Delete a Bio Mech Report', function () {
    bioMechPage.clickDeleteBioMechReportButton(0);
    bioMechPage.clickDeleteBioMechConfirmButton();

    // Wait to return to reports page
    cy.wait(100);

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', BIO_MECH_DELETED_SUCCESSFULLY);
  });
});
