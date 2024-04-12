export class EOTMPage {
  visit() {
    cy.visit('/employee-of-the-month');
    return this;
  }

  clickSeePastEOTMButton() {
    cy.get('[data-testid="see-past-eotm-button"]').click();
    return this;
  }

  clickAddEOTMButton() {
    cy.get('[data-testid="add-eotm-button"]').click();
    return this;
  }

  clickBackEOTMButton() {
    cy.get('[data-testid="back-button"]').click();
    return this;
  }

  clickSortUpdated() {
    cy.contains('span', 'Last updated').click();
    return this;
  }

  clickViewEOTMRow(index: number) {
    cy.get('[data-testid="row-data"]').eq(index).click();
    return this;
  }

  clickDeleteEOTM(index: number) {
    // Delete the index-th EOTM
    cy.get('[data-testid="delete-eotm-button"]').eq(index).click();
    return this;
  }

  clickDeleteEOTMConfirmButton() {
    cy.get('[data-testid="confirm-delete-eotm-button"]').click();
    return this;
  }

  clickEditEOTMButton(index: number) {
    // Delete the index-th EOTM
    cy.get('[data-testid="edit-eotm-button"]').eq(index).click();
    return this;
  }

  inputEmployeeName(input: string) {
    cy.get('[data-testid="eotm-name"]').clear().type(input);
    return this;
  }

  selectDepartment(type: string) {
    cy.get('[data-testid="eotm-department"]').select(type);
    return this;
  }

  inputDescription(input: string) {
    cy.get('[id="employee-description"]').clear().type(input);
    return this;
  }

  inputAwardDate(input: string) {
    cy.get('[id="employee-month"]').clear().type(input);
    return this;
  }

  uploadEmployeeImage(filePath: string) {
    cy.get('[id="employee-image"]').selectFile(filePath);
    return this;
  }

  clickSubmitEOTMButton() {
    cy.get('[data-testid="eotm-submit-button"]').click();
    return this;
  }
}
