export class MessageboardPage {
  visit() {
    cy.visit('/message-board');
    return this;
  }

  clickAddMessageButton() {
    cy.get('[data-testid="add-message-button"]').click();
    return this;
  }

  addMessage() {
    cy.get('[data-testid="add-message-add-message-button"').click();
    return this;
  }

  selectDepartment(department: string) {
    cy.get('[data-testid="add-message-department-dropdown"]').select(department);
    return this;
  }

  inputMessageTitle(input: string) {
    cy.get('[data-testid="add-message-title-input"').clear().type(input);
    return this;
  }

  inputMessageBody(input: string) {
    cy.get('[data-testid="add-message-body"]').clear().type(input);
    return this;
  }

  clickEditMessageBackButton() {
    cy.get('[data-testid="add-message-back-button"]').click();
    return this;
  }
}
