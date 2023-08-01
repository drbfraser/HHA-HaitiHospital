export class LoginPage {
  visit() {
    cy.visit('/login');
    return this;
  }

  usernameInput(input: string) {
    cy.get('#username').clear().type(input);
    return this;
  }

  passwordInput(input: string) {
    cy.get('#password').clear().type(input);
    return this;
  }

  clickSignIn() {
    cy.get('[data-testid="signin-button"]').click();
    return this;
  }
}
