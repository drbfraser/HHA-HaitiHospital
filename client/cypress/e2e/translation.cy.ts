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
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');

    cy.get('.sidebarDiv').find('ul li').as('Sidebar Items');
    cy.get('@Sidebar Items').eq(15).click();
  });

  it('Should Check That Analytics Is In French', function () {
    cy.get('@Sidebar Items').eq(3).click();
    cy.get('[data-testid="header"]').should('include.text', fr.sidebarAnalytics);
    cy.get('[data-testid="select-department-question-button"]').should(
      'include.text',
      fr.analyticsQuestion,
    );
  });

  it('Should Check That Messageboard Is In French', function () {
    cy.get('@Sidebar Items').eq(4).click();
    cy.get('[data-testid="header"]').should('include.text', fr.headerMessageBoard);
    cy.get('[data-testid="add-message-button"]').should('include.text', fr.messageBoardAddMessage);
  });

  it('Should Check That Leaderboard Page Is In French', function () {
    cy.get('@Sidebar Items').eq(5).click();
    cy.get('[data-testid="header"]').should('include.text', fr.headerLeaderBoard);
  });

  it('Should Check That Case Study Page Is In French', function () {
    cy.get('@Sidebar Items').eq(6).click();
    cy.get('[data-testid="header"]').should('include.text', fr.headerCaseStudy);
    cy.get('[data-testid="add-case-study-button"]').should(
      'include.text',
      fr.CaseStudy.Main.AddCaseStudy,
    );
    cy.get('[data-testid="case-study-table"]').contains('span', fr.CaseStudy.Main.CaseStudyType);
    cy.get('[data-testid="case-study-table"]').contains('span', fr.CaseStudy.Main.Author);
    cy.get('[data-testid="case-study-table"]').contains('span', fr.CaseStudy.Main.Created);
  });

  it('Should Check That Bio Support Page Is In French', function () {
    cy.get('@Sidebar Items').eq(7).click();
    cy.get('[data-testid="header"]').should('include.text', fr.headerBiomechanicalSupport);
  });

  it('Should Check That EOTM Page Is In French', function () {
    cy.get('@Sidebar Items').eq(8).click();
    cy.get('[data-testid="header"]').should('include.text', fr.headerEmployeeOfTheMonth);
    cy.get('[data-testid="add-eotm-button"]').should('include.text', fr.employeeOfTheMonthAdd);
  });
});
