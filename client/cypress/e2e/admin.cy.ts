/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import { USER_ADDED_SUCCESSFULLY, USER_DELETED_SUCCESSFULLY } from '../support/constants/toasts';
import { AdminPage } from '../support/pages/AdminPage';

describe('Admin Tests', function () {
  enum ROLES {
    ADMIN = 'Admin',
    MEDICAL_DIRECTOR = 'Medical Director',
    HEAD_OF_DEPARTMENT = 'Head of Department',
    USER = 'User',
  }

  enum DEPARTMENTS {
    Rehab = 'Rehab',
    NICU = 'NICU/Paeds',
    Maternity = 'Maternity',
    Community = 'Community & Health',
  }

  const loginPage = new LoginPage();
  const adminPage = new AdminPage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;
  const baseUrl = Cypress.env('baseUrl');
  const serverUrl = Cypress.env('serverUrl');

  let userIds: Array<string>;

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('include', '/home');
    userIds = new Array();

    // Tests run too quickly---cy.visit() is not working without this delay
    cy.wait(200);
    adminPage.visit();
  });

  it('Should Successfully Navigate Back to the Admin Page', function () {
    adminPage.clickAddUserButton();
    cy.url().should('equal', `${baseUrl}/admin/add-user`);
    adminPage.clickBackAddUserButton();
    cy.url().should('equal', `${baseUrl}/admin`);
  });

  it('Should Hide and Unhide Password', function () {
    adminPage.clickAddUserButton();
    cy.url().should('equal', `${baseUrl}/admin/add-user`);

    adminPage.inputUsername('username');
    adminPage.inputPassword('password');
    adminPage.clickTogglePasswordShow();
    cy.get('[id="password"][type="password"]').should('not.exist');
    cy.get('[id="password"][type="text"]').should('exist');

    adminPage.clickTogglePasswordShow();
    cy.get('[id="password"][type="text"]').should('not.exist');
    cy.get('[id="password"][type="password"]').should('exist');
  });

  it('Should Successfully Add a New User And Login With It', function () {
    const username = 'username';
    const password = 'Pas$w0rd';
    adminPage.clickAddUserButton();
    cy.url().should('equal', `${baseUrl}/admin/add-user`);

    adminPage.inputUsername(username);
    adminPage.inputPassword(password);
    adminPage.inputName('Handsome Squidward');
    adminPage.selectUserRole(ROLES.USER);
    adminPage.selectUserDepartment(DEPARTMENTS.Rehab);
    adminPage.clickSubmitUserButton();

    cy.url().should('equal', `${baseUrl}/admin`);

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', USER_ADDED_SUCCESSFULLY);
    toast.click({ multiple: true });

    adminPage.clickSignout();
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();
    cy.url().should('equal', `${baseUrl}/home`);
  });

  it('Should Not Be Able to Set Department For a New Admin User', function () {
    adminPage.clickAddUserButton();
    cy.url().should('equal', `${baseUrl}/admin/add-user`);

    adminPage.inputUsername('username');
    adminPage.inputPassword('password');
    adminPage.inputName('Handsome Squidward');
    adminPage.selectUserRole(ROLES.ADMIN);
    cy.get('[id="department"]').should('not.exist');
  });

  it('Should Not Be Able to Set Department For a New Medical Director User', function () {
    adminPage.clickAddUserButton();
    cy.url().should('equal', `${baseUrl}/admin/add-user`);

    adminPage.inputUsername('username');
    adminPage.inputPassword('password');
    adminPage.inputName('Handsome Squidward');
    adminPage.selectUserRole(ROLES.MEDICAL_DIRECTOR);
    cy.get('[id="department"]').should('not.exist');
  });

  it('Should Successfully Delete a User', function () {
    adminPage.clickDeleteUserButton(0);
    adminPage.clickDeleteUserConfirmButton();

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', USER_DELETED_SUCCESSFULLY);
    toast.click();
  });
});
