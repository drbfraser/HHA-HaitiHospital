export class CaseStudyPage {
  visit() {
    cy.visit('/case-study');
    return this;
  }

  clickAddCaseStudyButton() {
    cy.get('[data-testid="add-case-study-button"]').click();
    return this;
  }

  clickViewCaseStudyButton(index: number) {
    // View the index-th case study
    cy.get('[data-testid="view-case-study-button"]').eq(index).click();
    return this;
  }

  clickDeleteCaseStudyButton(index: number) {
    // Delete the index-th case study
    cy.get('[data-testid="delete-case-study-button"]').eq(index).click();
    return this;
  }

  clickDeleteCaseStudyModalConfirm() {
    cy.get('[data-testid="confirm-delete-case-study-button"]').click(); 
    return this; 
  }

  selectCaseStudyType(type: string) {
    cy.get('[id="CaseStudyType"]').select(type);
    return this;
  }

  inputPatientName(input: string) {
    cy.get('[id="Patient Name"]').clear().type(input);
    return this;
  }

  inputPatientAge(input: string) {
    // Input is a "number" but Cypress will change this to a string
    cy.get('[id="Patient Age"]').clear().type(input);
    return this;
  }

  inputPatientFrom(input: string) {
    cy.get('[id="Patient From"]').clear().type(input);
    return this;
  }

  inputPatientChoose(input: string) {
    cy.get('[id="Patient Choose"]').clear().type(input);
    return this;
  }

  inputPatientHowLong(input: string) {
    cy.get('[id="How long"]').clear().type(input);
    return this;
  }

  inputPatientDiagnosis(input: string) {
    cy.get('[id="Diagnosis"]').clear().type(input);
    return this;
  }

  inputPatientCaseStory(input: string) {
    cy.get('[id="Case Study 1"]').clear().type(input);
    return this;
  }

  uploadPatientFile(filePath: string) {
    cy.get('[id="customFilePatientStory"]').selectFile(filePath);
    return this;
  }

  checkConsentBox() {
    cy.get('[data-testid="case-study-patient-consent-check"]').check();
    return this;
  }

  clickSubmitCaseStudyButton() {
    cy.get('[data-testid="case-study-patient-submit-button"]').click();
    return this;
  }
}
