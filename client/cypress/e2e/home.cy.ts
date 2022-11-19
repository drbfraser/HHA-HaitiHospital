/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import en from '../../src/locales/en/translationEN.json';
import { HomePage } from '../support/pages/HomePage';

describe('Home Page Tests', function () {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  const username = Cypress.env('username');
  const password = Cypress.env('password');

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();
    cy.url().should('include', '/home');
  });

  it('Should Navigate to the Leaderboard Page', function () {
    homePage.clickLeaderboardPageButton();
    cy.url().should('include', '/leaderBoard');
  });

  it('Should Navigate to the Messages Page', function () {
    homePage.clickSeeMoreMessagesButton();
    cy.url().should('include', '/message-board');
  });
});
