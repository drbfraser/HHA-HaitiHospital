export class AdminPage {
  visit() {
    cy.visit('/admin');
    return this;
  }

  clickAddUserButton() {
    cy.get('[data-testid="add-user-button"]').click();
    return this;
  }

  clickEditUserButton(index: number) {
    cy.get('[data-testid="edit-user-button"]').eq(index).click();
    return this;
  }

  clickDeleteUserButton(index: number) {
    cy.get('[data-testid="view-user-button"]').eq(index).click();
    return this;
  }

  clickDeleteUserConfirmButton() {
    cy.get('[data-testid="confirm-delete-user-button"]').click();
    return this;
  }

  clickBackAddUserButton() {
    cy.get('[data-testid="add-user-back-button"]').click();
    return this;
  }

  clickSubmitUserButton() {
    cy.get('[data-testid="add-user-submit-button"]').click();
    return this;
  }

  inputUsername(input: string) {
    cy.get('[id="username"]').clear().type(input);
    return this;
  }

  inputPassword(input: string) {
    cy.get('[id="password"]').clear().type(input);
    return this;
  }

  inputName(input: string) {
    cy.get('[id="name"]').clear().type(input);
    return this;
  }

  selectUserRole(type: string) {
    cy.get('[id="role"]').select(type);
    return this;
  }

  selectUserDepartment(type: string) {
    cy.get('[id="department"]').select(type);
    return this;
  }

  clickTogglePasswordShow() {
    cy.get('[data-testid="toggle-password-shown"]').click();
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
