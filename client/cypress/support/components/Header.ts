export class HeaderComponent {
  getHeader(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-testid="header"]`);
  }
}
