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

    // cy.wait(100); // Need to wait for API call (otherwise departments are not the in desired order)
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

  it('Should Fail to Login Due to Invalid Credentials', () => {
    cy.intercept('POST', `${serverUrl}/api/auth/login`).as('loginReq');
    loginPage.usernameInput('wrong_username').passwordInput('wrong_password').clickLoginButton();
    cy.wait('@loginReq').then((intercept) => {
      const { statusCode } = intercept.response;
      expect(statusCode).to.eq(401);
    });
    cy.contains(en.signInInvalidLoginCredentials).should('be.visible');
  });

  it('Should successfully Signout', () => {
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();
    cy.url().should('include', '/home');
    homePage.clickSignout();
    cy.url().should('include', '/login');
  });
});
