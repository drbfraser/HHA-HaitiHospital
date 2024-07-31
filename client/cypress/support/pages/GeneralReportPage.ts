export class GeneralReportPage {
  visit() {
    cy.visit('/general-reports');
    return this;
  }

  clickCreateNewReport() {
    cy.get('[data-testid="create-report-button"]').click();
    return this;
  }
  clickSearchReportTextField() {
    cy.get('[data-testid="filter-input-group"]').click();
    return this;
  }
  typeSearchReportTextField(value: string) {
    cy.get('[data-testid="filter-input-group"]').type(value);
    return this;
  }
  clickIndividualReport() {
    cy.get('tbody tr').first().click();
  }
  clickEditReport() {
    cy.get('[data-testid=edit-report-button]').first().click();
  }
  clickEditFormButton() {
    cy.get('[data-testid=edit-form-button]').click();
  }
  clickEditMonthButton() {
    cy.get('[data-testid=edit-month-button]').click();
  }
  clickUpdateButton() {
    cy.get('[data-testid=report-submit-button]').click();
  }
  clickSaveAsDraftButton() {
    cy.get('[data-testid=report-save-as-draft-button]').click();
  }
  clickApplyChangesButton() {
    cy.get('[data-testid=report-apply-changes-month-button]').click();
  }
  clickConfirmationModalConfirmButton() {
    cy.get('[data-testid=confirmation-modal-confirm-button]').click();
  }
  clickConfirmationModalCancelButton() {
    cy.get('[data-testid=confirmation-modal-cancel-button]').click();
  }
  clickDownloadExcelButton() {
    cy.get('[data-testid=report-download-excel-button]').click();
  }
}
