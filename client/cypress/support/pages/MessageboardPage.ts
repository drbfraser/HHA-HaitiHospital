export class MessageboardPage {
  visit() {
    cy.visit('/message-board');
    return this;
  }

  clickAddMessageButton() {
    cy.get('[data-testid="add-message-button"]').click();
    return this;
  }

  clickEditMessageButton() {
    cy.get('[data-testid="edit-message-button"]').eq(0).click();
    return this;
  }

  clickDeleteMessageButtons() {
    cy.get('[data-testid="delete-message-button"]').eq(0).click();
    cy.get('[data-testid="confirm-delete-message-button"]').click();
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
    cy.get('[data-testid="add-message-title-input"]').clear().type(input);
    return this;
  }

  inputMessageBody(input: string) {
    cy.get('[data-testid="add-message-body"]').clear().type(input);
    return this;
  }

  getMessageTitle(): string {
    let messageTitle: string = '';
    cy.get('[data-testid="message-title"]')
      .invoke('text')
      .then(function (text) {
        messageTitle = text.toString();
      });
    return messageTitle;
  }

  getMessageBody(): string {
    let messageBody: string = '';
    cy.get('[data-testid="message-body"]')
      .invoke('text')
      .then(function (text) {
        messageBody = text.toString();
      });
    return messageBody;
  }

  clickEditMessageBackButton() {
    cy.get('[data-testid="back-button"]').click();
    return this;
  }
}
