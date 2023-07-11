/// <reference types="cypress" />

import { HomePage } from '../support/pages/HomePage';
import { LoginPage } from '../support/pages/LoginPage';
import fr from '../../src/locales/fr/translationFR.json';

describe('French Translation Tests', function () {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;

  beforeEach('Logging in and Clicking on French', function () {
    cy.viewport(1200, 900);

    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();

    // Tests run too quickly---cy.visit() is not working without this delay
    cy.wait(100);

    cy.get('.Sidebar').find('ul li').as('Sidebar Items');
    cy.get('@Sidebar Items').eq(18).click();
  });

  it('Should Check That Messageboard Is In French', function () {
    cy.get('@Sidebar Items').eq(1).click();
    cy.get('[data-testid="messageboard-header"]').should('include.text', fr.headerMessageBoard);
    cy.get('[data-testid="add-message-button"]').should('include.text', fr.messageBoardAddMessage);
  });

  it('Should Check That Leaderboard Page Is In French', function () {
    cy.get('@Sidebar Items').eq(2).click();
    cy.get('[data-testid="leaderboard-header"]').should('include.text', fr.headerLeaderBoard);
    cy.get('[data-testid="case-study-patient-title"]')
      .parent()
      .should('include.text', fr.caseStudyFormPatientStoryCaseStudy);
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
  });

  it('Should Check That Case Study Page Is In French', function () {
    cy.get('@Sidebar Items').eq(3).click();
    cy.get('[data-testid="case-study-header"]').should('include.text', fr.headerCaseStudy);
    cy.get('[data-testid="add-case-study-button"]').should(
      'include.text',
      fr.CaseStudy.Main.AddCaseStudy,
    );
    cy.get('[data-testid="case-study-type-title"]').should(
      'include.text',
      fr.CaseStudy.Main.CaseStudyType,
    );
    cy.get('[data-testid="case-study-author-title"]').should(
      'include.text',
      fr.CaseStudy.Main.Author,
    );
    cy.get('[data-testid="case-study-created-title"]').should(
      'include.text',
      fr.CaseStudy.Main.Created,
    );
    cy.get('[data-testid="case-study-options-title"]').should(
      'include.text',
      fr.CaseStudy.Main.Link,
    );
  });

  it('Should Check That Bio Support Page Is In French', function () {
    cy.get('@Sidebar Items').eq(4).click();
    cy.get('[data-testid="biomech-header"]').should('include.text', fr.headerBiomechanicalSupport);
  });

  it('Should Check That EOTM Page Is In French', function () {
    cy.get('@Sidebar Items').eq(5).click();
    cy.get('[data-testid="eotm-header"]').should('include.text', fr.headerEmployeeOfTheMonth);
    cy.get('[data-testid="update-eotm-button"]').should('include.text', fr.employeeOfTheMonthEdit);
  });
});
