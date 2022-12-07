export class EOTMPage {
  visit() {
    cy.visit('/employee-of-the-month');
    return this;
  }

  clickUpdateEOTMButton() {
    cy.get('[data-testid="update-eotm-button"]').click();
    return this;
  }

  clickBackEOTMButton() {
    cy.get('[data-testid="back-eotm-button"').click();
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

  uploadEmployeeImage(filePath: string) {
    cy.get('[id="employee-image"]').selectFile(filePath);
    return this;
  }

  clickSubmitEOTMButton() {
    cy.get('[data-testid="eotm-submit-button"]').click();
    return this;
  }
}
