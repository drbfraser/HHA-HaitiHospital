/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import en from '../../src/locales/en/translationEN.json';
import { HomePage } from '../support/pages/HomePage';

describe('Admin Login Tests', () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;
  const serverUrl = Cypress.env('serverUrl');

  beforeEach('Go to page', () => {
    loginPage.visit();
    cy.contains(en.signInSignIn).should('be.visible');
  });

  it('Should Login Successfully As Admin', () => {
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();
    cy.url().should('include', '/home');
  });

  it('Should Fail to Login Due to Invalid Credentials', () => {
    cy.intercept('POST', `${serverUrl}/api/auth/login`).as('loginReq');
    loginPage.usernameInput('wrong_username').passwordInput('wrong_password').clickLoginButton();
    cy.wait('@loginReq').then((intercept) => {
      const { statusCode } = intercept.response;
      expect(statusCode).to.eq(401);
    });
    cy.contains(en.signInInvalidLoginCredentials).should('be.visible');
  });

  it('Should Successfully Signout', () => {
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();
    cy.url().should('include', '/home');
    homePage.clickSignout();
    cy.url().should('include', '/login');
  });
});

describe('User Login Tests', () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  const username = Cypress.env('User').username;
  const password = Cypress.env('User').password;

  beforeEach('Go to page', () => {
    loginPage.visit();
    cy.contains(en.signInSignIn).should('be.visible');
  });

  it('Should Login Successfully As Admin', () => {
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();
    cy.url().should('include', '/home');
  });

  it('Should Successfully Signout', () => {
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();
    cy.url().should('include', '/home');
    homePage.clickSignout();
    cy.url().should('include', '/login');
  });
});
