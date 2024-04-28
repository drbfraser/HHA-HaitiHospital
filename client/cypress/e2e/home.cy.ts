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
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
  });

  it('Should Ensure that Sidebar Links Correspond to Admin Role', function () {
    cy.contains(en.leaderBoardOverviewDepartmentLeader).should('be.visible');
    cy.contains(en.dashboardMessageOverviewMessages).should('be.visible');

    cy.get('[id="sidebar-logo"]').should('be.visible');
    homePage.clickExpandSidebar();
    cy.get('.sidebarDiv').find('ul li').as('Sidebar Items');

    // Check that the sidebar links correspond to the User role
    cy.get('@Sidebar Items').eq(1).should('include.text', en.sidebarHome);
    cy.get('@Sidebar Items').eq(2).should('include.text', en.sidebarReports);
    cy.get('@Sidebar Items').eq(3).should('include.text', en.sidebarMessageBoard);
    cy.get('@Sidebar Items').eq(4).should('include.text', en.sidebarLeaderBoard);
    cy.get('@Sidebar Items').eq(5).should('include.text', en.sidebarCaseStudy);
    cy.get('@Sidebar Items').eq(6).should('include.text', en.sidebarBioSupport);
    cy.get('@Sidebar Items').eq(7).should('include.text', en.sidebarEmployeeOfTheMonth);
    // 8th item is a divider
    cy.get('@Sidebar Items').eq(9).should('include.text', en.sidebarAdmin);
    // 10th item is a divider
    cy.get('@Sidebar Items').eq(11).should('include.text', en.sidebarUsers);
    // 12th item is a divider
    cy.get('@Sidebar Items').eq(13).should('include.text', en.sidebarEnglish);
    cy.get('@Sidebar Items').eq(14).should('include.text', en.sidebarFrench);
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
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
  });

  it('Should Ensure that Sidebar Links Correspond to User Role', function () {
    cy.contains(en.leaderBoardOverviewDepartmentLeader).should('be.visible');
    cy.contains(en.dashboardMessageOverviewMessages).should('be.visible');

    cy.get('[id="sidebar-logo"]').should('be.visible');
    homePage.clickExpandSidebar();
    cy.get('.sidebarDiv').find('ul li').as('Sidebar Items');

    // Check that the sidebar links correspond to the User role
    cy.get('@Sidebar Items').eq(1).should('include.text', en.sidebarHome);
    cy.get('@Sidebar Items').eq(2).should('include.text', en.sidebarReports);
    cy.get('@Sidebar Items').eq(3).should('include.text', en.sidebarMessageBoard);
    cy.get('@Sidebar Items').eq(4).should('include.text', en.sidebarLeaderBoard);
    cy.get('@Sidebar Items').eq(5).should('include.text', en.sidebarCaseStudy);
    cy.get('@Sidebar Items').eq(6).should('include.text', en.sidebarBioSupport);
    cy.get('@Sidebar Items').eq(7).should('include.text', en.sidebarEmployeeOfTheMonth);
    // 8th item is a divider
    cy.get('@Sidebar Items').eq(9).should('include.text', en.sidebarEnglish);
    cy.get('@Sidebar Items').eq(10).should('include.text', en.sidebarFrench);
  });
});
