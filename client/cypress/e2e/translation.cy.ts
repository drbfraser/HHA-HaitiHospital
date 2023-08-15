/// <reference types="cypress" />

import { HomePage } from '../support/pages/HomePage';
import { LoginPage } from '../support/pages/LoginPage';
import fr from '../../src/locales/fr/translationFR.json';
import { HeaderComponent } from '../support/components/Header';

describe('French Translation Tests', function () {
  const loginPage = new LoginPage();
  const headerComponent = new HeaderComponent();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;

  beforeEach('Logging in and Clicking on French', function () {
    cy.viewport(1200, 900);

    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();

    // Tests run too quickly---cy.visit() is not working without this delay
    cy.wait(100);

    cy.get('[data-testid="sidebar-li"]').as('Sidebar Items');
    cy.get('[data-testid="french-translation"]').click();
  });

  // it('Should Check That Messageboard Is In French', function () {
  //   cy.get('@Sidebar Items').eq(1).click();
  //   headerComponent.getHeader().should('include.text', fr.headerMessageBoard);
  //   cy.get('[data-testid="add-message-button"]').should('include.text', fr.messageBoardAddMessage);
  // });

  it('Message board, Leaderboard, Bio Support Page, and EOTM pages should be in French', function () {
    // Message Board page
    cy.get('@Sidebar Items').eq(1).click();
    headerComponent.getHeader().should('include.text', fr.headerMessageBoard);
    cy.get('[data-testid="add-message-button"]').should('include.text', fr.messageBoardAddMessage);

    // Leaderboard page
    cy.get('@Sidebar Items').eq(2).click();
    headerComponent.getHeader().should('include.text', fr.headerLeaderBoard);
    cy.get('[data-testid="leaderboard-case-study-header"]')
      .parent()
      .should('include.text', fr.headerCaseStudy);
    cy.get('[data-testid="case-study-patient-name"]')
      .parent()
      .should('include.text', fr.caseStudyFormPatientName);
    cy.get('[data-testid="case-study-patient-age"]')
      .parent()
      .should('include.text', fr.caseStudyFormPatientAge);
    cy.get('[data-testid="case-study-patient-from"]')
      .parent()
      .should('include.text', fr.caseStudyFormWherePatientFrom);
    cy.get('[data-testid="case-study-patient-why-come"]')
      .parent()
      .should('include.text', fr.caseStudyFormWhyPatientChooseHCBH);
    cy.get('[data-testid="case-study-patient-how-long"]')
      .parent()
      .should('include.text', fr.caseStudyFormHowLongAtHCBH);
    cy.get('[data-testid="case-study-patient-diagnosis"]')
      .parent()
      .should('include.text', fr.caseStudyFormWhatWasTheirDiagnosis);
    cy.get('[data-testid="case-study-patient-case-story"]')
      .parent()
      .should('include.text', fr['caseStudyFormCaseStudy/Story']);

    // Biomech page
    cy.get('@Sidebar Items').eq(4).click();
    headerComponent.getHeader().should('include.text', fr.headerBiomechanicalSupport);

    // EOTM page
    cy.get('@Sidebar Items').eq(5).click();
    headerComponent.getHeader().should('include.text', fr.headerEmployeeOfTheMonth);
    cy.get('[data-testid="update-eotm-button"]').should('include.text', fr.employeeOfTheMonthEdit);
  });
});
