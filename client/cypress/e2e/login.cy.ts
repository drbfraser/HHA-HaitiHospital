/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import en from '../../src/locales/en/translationEN.json';
import { HomePage } from '../support/pages/HomePage';

describe('Login tests', () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const serverUrl = Cypress.env('serverUrl');

  beforeEach('Go to page', () => {
    loginPage.visit();
    cy.contains(en.signInSignIn).should('be.visible');
  });

  it('should login successfully', () => {
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();
    cy.url().should('include', '/home');
    cy.contains(en.leaderBoardOverviewDepartmentLeader).should('be.visible');
  });

  it('should fail login', () => {
    cy.intercept('POST', `${serverUrl}/api/auth/login`).as('loginReq');
    loginPage.usernameInput('wrong_username').passwordInput('wrong_password').clickLoginButton();
    cy.wait('@loginReq').then((intercept) => {
      const { statusCode } = intercept.response;
      expect(statusCode).to.eq(401);
    });
    cy.contains(en.signInInvalidLoginCredentials).should('be.visible');
  });

  it('should signout', () => {
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();
    cy.url().should('include', '/home');
    homePage.clickSignout();
    cy.url().should('include', '/login');
  });
});
