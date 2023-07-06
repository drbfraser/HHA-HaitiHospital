export class BioMechPage {
  visit() {
    cy.visit('/biomechanic');
    return this;
  }

  clickAddBioMechReportButton() {
    cy.get('[data-testid="add-biomech-button"]').click();
    return this;
  }

  clickBackAddBioMechReportButton() {
    cy.get('[data-testid="biomech-add-back-button"').click();
    return this;
  }

  clickBackViewBioMechReportButton() {
    cy.get('[data-testid="biomech-view-back-button"').click();
    return this;
  }

  clickSubmitBioMechReportButton() {
    cy.get('[data-testid="submit-biomech-button"]').click();
    return this;
  }

  clickViewBioMechReportButton(index: number) {
    // View the index-th Bio Mech Report
    cy.get(`[data-testid="view-biomech-report"]`).eq(index).click();
    return this;
  }

  clickDeleteBioMechReportButton(index: number) {
    // Delete the index-th Bio Mech Report
    cy.get('[data-testid="delete-biomech-button"]').eq(index).click();
    return this;
  }

  clickDeleteBioMechConfirmButton() {
    cy.get('[data-testid="confirm-delete-biomech-button"]').click();
    return this;
  }

  inputEquipmentName(input: string) {
    cy.get('[id="Equipment Name"]').clear().type(input);
    return this;
  }

  inputEquipmentIssue(input: string) {
    cy.get('[id="Equipment Fault"]').clear().type(input);
    return this;
  }

  selectEquipmentPriority(type: string) {
    cy.get('[id="Equipment Priority"]').select(type);
    return this;
  }

  selectEquipmentStatus(type: string) {
    cy.get('[id="Equipment Status"]').select(type);
    return this;
  }

  uploadEquipmentFile(filePath: string) {
    cy.get('[id="customFileBioMech"]').selectFile(filePath);
    return this;
  }
}
