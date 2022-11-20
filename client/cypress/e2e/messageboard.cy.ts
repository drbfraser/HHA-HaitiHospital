/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import en from '../../src/locales/en/translationEN.json';
import { MessageboardPage } from '../support/pages/MessageboardPage';

describe('Messageboard Tests', function () {
  const loginPage = new LoginPage();
  const messageboardPage = new MessageboardPage();

  const username = Cypress.env('username');
  const password = Cypress.env('password');

  beforeEach('Logging in...', function () {
    loginPage.visit();
    loginPage.usernameInput(username).passwordInput(password).clickLoginButton();

    // Tests run too quickly---cy.visit() is not working without this delay
    cy.wait(100);
    messageboardPage.visit();
  });

  it('Should Navigate Back to the Messageboard', function () {
    messageboardPage.clickAddMessageButton();
    messageboardPage.clickEditMessageBackButton();
    cy.url().should('include', '/message-board');
  });

  it('Should Add a New Message', function () {
    messageboardPage.clickAddMessageButton();
    cy.url().should('include', '/message-board/add-message');

    messageboardPage.selectDepartment('General');
    messageboardPage.inputMessageTitle('Test Title');
    messageboardPage.inputMessageBody('Test Body');
    messageboardPage.addMessage();

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', 'Message is successfully added!');
    toast.click();
  });

  it('Should Edit a Message', function () {
    // messageboardPage.clickEditMessageButton();
    // cy.url().should('include', '/message-board/edit');

    // messageboardPage.selectDepartment('General');
    // messageboardPage.inputMessageTitle('Test Title EDITED');
    // messageboardPage.inputMessageBody('Test Body EDITED');
    // messageboardPage.addMessage();

    // const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    // toast.should('include.text', 'Must select a department');
    // toast.click();
  });

  it('Should Delete a New Message', function () {
    messageboardPage.clickAddMessageButton();
    cy.url().should('include', '/message-board/add-message');

    messageboardPage.selectDepartment('General');
    messageboardPage.inputMessageTitle('Test Title TO BE DELETED');
    messageboardPage.inputMessageBody('Test Body TO BE DELETED');
    messageboardPage.addMessage();

    const messageAddedtoast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    messageAddedtoast.click();
    cy.wait(1000); // Wait one second for the toast to disappear before proceeding

    messageboardPage.clickDeleteMessageButtons();
    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', 'Message deleted!');
    toast.click();

    cy.contains('div.message-panel', 'Test Title TO BE DELETED').should('not.exist');
    cy.contains('div.message-panel', 'Test Body TO BE DELETED').should('not.exist');
  });

  it('Should Fail to Add a New Message Due to Invalid Department', function () {
    messageboardPage.clickAddMessageButton();
    cy.url().should('include', '/message-board/add-message');

    messageboardPage.inputMessageTitle('Test Title');
    messageboardPage.inputMessageBody('Test Body');
    messageboardPage.addMessage();

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', 'Must select a department');
    toast.click();
  });

  it('Should Fail to Add a New Message Due to Empty Message', function () {
    messageboardPage.clickAddMessageButton();
    cy.url().should('include', '/message-board/add-message');

    messageboardPage.selectDepartment('General');
    messageboardPage.addMessage();

    const toast: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('div.Toastify__toast');
    toast.should('include.text', 'Internal Error: Unable to add message');
    toast.click();
  });
});
