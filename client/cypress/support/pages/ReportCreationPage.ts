export class ReportCreationPage {
  visit() {
    cy.visit('/report');
    return this;
  }
  chooseDepartmentTypeDropdown() {
    cy.get('[data-testid="department-type-dropdown"]').select('Rehab');
  }
  selectMonthDropdown() {
    cy.get('[data-testid="month-select-dropdown"]').select(1);
  }
  selectYearDropdown(validyear: string) {
    cy.get('[data-testid="year-select-dropdown"]').clear().type(validyear);
  }
  clickNextButton() {
    cy.get('[data-testid="report-next-button"]').click();
  }
  chooseDifferentDepartmentButton() {
    cy.get('[data-testid="choose-different-department-button"]').click();
  }
  typeFormField() {
    cy.get('[data-testid="form-field"]').each(($el) => {
      cy.wrap($el).clear().type('2');
    });
  }
  clickSaveAsDraftButton() {
    cy.get('[data-testid=report-save-as-draft-button]').click();
  }
  clickConfirmationModalConfirmButton() {
    cy.get('[data-testid=confirmation-modal-confirm-button]').click();
  }
  clickSubmitButton() {
    cy.get('[data-testid=report-submit-button]').click();
  }
}
