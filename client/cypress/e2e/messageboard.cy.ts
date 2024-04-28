/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import { MessageboardPage } from '../support/pages/MessageboardPage';
import {
  MESSAGE_NO_DEPARTMENT_SELECTED,
  MISSING_TITLE_BODY_MSG,
} from '../support/constants/toasts';
import { ResponseMessage } from '../support/constants/response_message';

describe('Messageboard Tests', function () {
  const loginPage = new LoginPage();
  const messageboardPage = new MessageboardPage();

  const username = Cypress.env('Admin').username;
  const password = Cypress.env('Admin').password;
  const baseUrl = Cypress.env('baseUrl');

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();

    cy.url().should('include', '/home');
    messageboardPage.visit();
  });

  it('Should Navigate Back to the Messageboard', function () {
    messageboardPage.clickAddMessageButton();
    messageboardPage.clickEditMessageBackButton();
    cy.url().should('equal', `${baseUrl}/message-board`);
  });

  it('Should Add a New Message', function () {
    messageboardPage.clickAddMessageButton();
    cy.url().should('equal', `${baseUrl}/message-board/add-message`);

    messageboardPage.selectDepartment('General');
    messageboardPage.inputMessageTitle('Test Title');
    messageboardPage.inputMessageBody('Test Body');
    messageboardPage.addMessage();
    cy.url().should('equal', `${baseUrl}/message-board`);

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', ResponseMessage.getMsgCreatePostOk());
    toast.click();

    cy.get('[data-testid="message-title"]').contains('Test Title');
    cy.get('[data-testid="message-body"]').contains('p', 'Test Body');
  });

  it('Should Edit a Message', function () {
    messageboardPage.clickEditMessageButton();
    cy.url().should('include', `${baseUrl}/message-board/edit`);

    messageboardPage.selectDepartment('General');
    messageboardPage.inputMessageTitle('Test Title EDITED');
    messageboardPage.inputMessageBody('Test Body EDITED');
    messageboardPage.addMessage();
    cy.url().should('equal', `${baseUrl}/message-board`);

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', ResponseMessage.getMsgCreatePostOk());
    toast.click();

    cy.get('[data-testid="message-title"]').contains('Test Title EDITED');
    cy.get('[data-testid="message-body"]').contains('Test Body EDITED');
  });

  it('Should Delete a New Message', function () {
    messageboardPage.clickAddMessageButton();
    cy.url().should('equal', `${baseUrl}/message-board/add-message`);

    const newTitle = 'Test Title TO BE DELETED';
    const newBody = 'Test Body TO BE DELETED';
    messageboardPage.selectDepartment('General');
    messageboardPage.inputMessageTitle(newTitle);
    messageboardPage.inputMessageBody(newBody);
    messageboardPage.addMessage();

    const messageAddedtoast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    messageAddedtoast.click();
    cy.url().should('equal', `${baseUrl}/message-board`);
    cy.wait(1000); // Wait one second for the toast to disappear before proceeding

    messageboardPage.clickDeleteMessageButtons();
    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', ResponseMessage.getMsgDeletePostOk());
    toast.click();
    cy.wait(1000); // Wait for the message to be deleted (the tests are too fast)

    cy.get('[data-testid="message-title"]').contains(newTitle).should('not.exist');
    cy.get('[data-testid="message-body"]').contains(newBody).should('not.exist');
  });

  it('Should Fail to Add a New Message Due to Invalid Department', function () {
    messageboardPage.clickAddMessageButton();
    cy.url().should('equal', `${baseUrl}/message-board/add-message`);

    messageboardPage.inputMessageTitle('Test Title');
    messageboardPage.inputMessageBody('Test Body');
    messageboardPage.addMessage();
    cy.url().should('equal', `${baseUrl}/message-board/add-message`);

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', MESSAGE_NO_DEPARTMENT_SELECTED);
    toast.click();
  });

  it('Should Fail to Add a New Message Due to Empty Message', function () {
    messageboardPage.clickAddMessageButton();
    cy.url().should('equal', `${baseUrl}/message-board/add-message`);

    messageboardPage.selectDepartment('General');
    messageboardPage.addMessage();
    cy.url().should('equal', `${baseUrl}/message-board/add-message`);

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', MISSING_TITLE_BODY_MSG);
    toast.click();
  });
});

describe('Messageboard Test for User', function () {
  const username = Cypress.env('User').username;
  const password = Cypress.env('User').password;

  const loginPage = new LoginPage();
  const messageboardPage = new MessageboardPage();

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickSignIn();

    // Tests run too quickly---cy.visit() is not working without this delay
    cy.wait(100);
    messageboardPage.visit();
  });

  it('Edit and Delete Options Should be Disabled for User', function () {
    cy.contains('button', 'Edit').should('not.exist');
    cy.contains('button', 'Delete').should('not.exist');
  });
});
