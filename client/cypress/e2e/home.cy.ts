/// <reference types="cypress" />

import { LoginPage } from '../support/pages/LoginPage';
import en from '../../src/locales/en/translationEN.json';
import { HomePage } from '../support/pages/HomePage';

describe('Login tests', function () {
  const homePage = new HomePage();

  beforeEach('Go to page', function () {
    homePage.visit();
    cy.contains(en.signInSignIn).should('be.visible');
  });

  it('should login successfully', function () {});
});
