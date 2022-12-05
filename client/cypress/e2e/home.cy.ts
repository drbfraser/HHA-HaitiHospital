/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import en from '../../src/locales/en/translationEN.json';
import { HomePage } from '../support/pages/HomePage';

describe('Admin Home Page Tests', function () {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();
    cy.url().should('include', '/home');
  });

  it('Should Ensure that Sidebar Links Correspond to Admin Role', function () {
    cy.contains(en.leaderBoardOverviewDepartmentLeader).should('be.visible');
    cy.contains(en.dashboardMessageOverviewMessages).should('be.visible');

    cy.get('.sidebar_logo').should('be.visible');
    cy.get('.Sidebar').find('ul li').as('Sidebar Items');

    // Check that the sidebar links correspond to the admin role
    cy.get('@Sidebar Items').eq(0).should('include.text', 'Home');
    cy.get('@Sidebar Items').eq(1).should('include.text', 'Message Board');
    cy.get('@Sidebar Items').eq(2).should('include.text', 'Leaderboard');
    cy.get('@Sidebar Items').eq(3).should('include.text', 'Case Study');
    cy.get('@Sidebar Items').eq(4).should('include.text', 'Bio Support');
    cy.get('@Sidebar Items').eq(5).should('include.text', 'Employee of the Month');
    // 6th item is a divider
    cy.get('@Sidebar Items').eq(7).should('include.text', 'General');
    cy.get('@Sidebar Items').eq(8).should('include.text', 'Rehab');
    cy.get('@Sidebar Items').eq(9).should('include.text', 'NICU/Paeds');
    cy.get('@Sidebar Items').eq(10).should('include.text', 'Maternity');
    cy.get('@Sidebar Items').eq(11).should('include.text', 'Com & Health');
    cy.get('@Sidebar Items').eq(12).should('include.text', 'Report');
    cy.get('@Sidebar Items').eq(13).should('include.text', 'Old Report');
    // 14th item is a divider
    cy.get('@Sidebar Items').eq(15).should('include.text', 'Admin');
    // 16th item is a divider
    cy.get('@Sidebar Items').eq(17).should('include.text', 'English');
    cy.get('@Sidebar Items').eq(18).should('include.text', 'Français');
  });

  it('Should Navigate to the Leaderboard Page', function () {
    homePage.clickLeaderBoardPageButton();
    cy.url().should('include', '/leaderBoard');
  });

  it('Should Navigate to the Messages Page', function () {
    homePage.clickSeeMoreMessagesButton();
    cy.url().should('include', '/message-board');
  });
});

describe('User Home Page Tests', function () {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  const username = Cypress.env('User').username;
  const password = Cypress.env('User').password;

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();
    cy.url().should('include', '/home');
  });

  it('Should Ensure that Sidebar Links Correspond to User Role', function () {
    cy.contains(en.leaderBoardOverviewDepartmentLeader).should('be.visible');
    cy.contains(en.dashboardMessageOverviewMessages).should('be.visible');

    cy.get('.sidebar_logo').should('be.visible');
    cy.get('.Sidebar').find('ul li').as('Sidebar Items');

    // Check that the sidebar links correspond to the User role
    cy.get('@Sidebar Items').eq(0).should('include.text', 'Home');
    cy.get('@Sidebar Items').eq(1).should('include.text', 'Message Board');
    cy.get('@Sidebar Items').eq(2).should('include.text', 'Leaderboard');
    cy.get('@Sidebar Items').eq(3).should('include.text', 'Case Study');
    cy.get('@Sidebar Items').eq(4).should('include.text', 'Bio Support');
    cy.get('@Sidebar Items').eq(5).should('include.text', 'Employee of the Month');
    // 6th item is a divider
    cy.get('@Sidebar Items').eq(7).should('include.text', 'Report');
    cy.get('@Sidebar Items').eq(8).should('include.text', 'Old Report');
    // 9th item is a divider
    cy.get('@Sidebar Items').eq(10).should('include.text', 'English');
    cy.get('@Sidebar Items').eq(11).should('include.text', 'Français');
  });
});
