export class HomePage {
  visit() {
    cy.visit('/home');
    return this;
  }

  clickUserDropdown() {
    cy.get('[data-testid="user-dropdown"]').click();
    return this;
  }

  clickSignout() {
    this.clickUserDropdown();
    cy.get('[data-testid="signout-button"]').click();
    return this;
  }
}
