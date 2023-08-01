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
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
  });

  it('Should Fail to Login Due to Invalid Credentials', () => {
    cy.intercept('POST', `${serverUrl}/api/auth/login`).as('loginReq');
    loginPage.usernameInput('wrong_username').passwordInput('wrong_password').clickSignIn();
    cy.wait('@loginReq').then((intercept) => {
      const { statusCode } = intercept.response;
      expect(statusCode).to.eq(401);
    });
    cy.contains(en.signInInvalidLoginCredentials).should('be.visible');
  });

  it('Should Successfully Signout', () => {
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
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

  it('Should Login Successfully As User', () => {
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
  });

  it('Should Successfully Signout', () => {
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
    homePage.clickSignout();
    cy.url().should('include', '/login');
  });
});

describe('Medical Director Login tests', () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  const username = Cypress.env('MedicalDirector').username;
  const password = Cypress.env('MedicalDirector').password;

  beforeEach('Go to page', () => {
    loginPage.visit();
    cy.contains(en.signInSignIn).should('be.visible');
  });

  it('Should Login Successfully As A Medical Director', () => {
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
    homePage.clickUserDropdown();
    cy.get('[data-testid="user-role"]').should('contain', 'Medical Director');
  });

  it('Should Successfully Signout', () => {
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
    homePage.clickSignout();
    cy.url().should('include', '/login');
  });
});

describe('Head of NICU/Paeds Login tests', () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  const username = Cypress.env('HeadOfDepartment').username;
  const password = Cypress.env('HeadOfDepartment').password;

  beforeEach('Go to page', () => {
    loginPage.visit();
    cy.contains(en.signInSignIn).should('be.visible');
  });

  it('Should Login Successfully As A Head Of Department', () => {
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
    homePage.clickUserDropdown();
    cy.get('[data-testid="user-role"]').should('contain', 'Head of Department');
    cy.get('[data-testid="user-department"]').should('contain', 'NICU/Paeds');
  });

  it('Should Successfully Signout', () => {
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
    homePage.clickSignout();
    cy.url().should('include', '/login');
  });
});
