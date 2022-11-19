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

    // Check that the correct toast is fired
    cy.get('div.Toastify__toast')
      .invoke('text')
      .then(function (toastText) {
        expect(toastText).to.equal('Message is successfully added!');

        // Check that the message has been added to the messageboard
        cy.contains('p', 'Test Title')
        cy.contains('p', 'Test Body');
      });
  });

  it('Should Fail to Add a New Message Due to Invalid Department', function () {
    messageboardPage.clickAddMessageButton();
    cy.url().should('include', '/message-board/add-message');

    messageboardPage.inputMessageTitle('Test Title');
    messageboardPage.inputMessageBody('Test Body');
    messageboardPage.addMessage();

    // Check that the correct toast is fired
    cy.get('div.Toastify__toast')
      .invoke('text')
      .then(function (toastText) {
        expect(toastText).to.equal('Must select a department');
      });
  });

  it('Should Fail to Add a New Message Due to Empty Message', function () {
    messageboardPage.clickAddMessageButton();
    cy.url().should('include', '/message-board/add-message');

    messageboardPage.selectDepartment('General');
    messageboardPage.addMessage();

    // Check that the correct toast is fired
    cy.get('div.Toastify__toast')
      .invoke('text')
      .then(function (toastText) {
        expect(toastText).to.equal('Internal Error: Unable to add message');
      });
  });
});
