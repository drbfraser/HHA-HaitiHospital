export class ReportCreationPage {
  visit() {
    cy.visit('/report');
    return this;
  }
  chooseDepartmentTypeDropdown() {
    cy.get('[data-testid="department-type-dropdown"]').select(1);
    return this;
  }
  chooseMonthDropdown() {
    cy.get('[data-testid="month-select-dropdown"]').select(1);
    return this;
  }
  chooseYearDropdown() {
    cy.get('[data-testid="year-select-dropdown"]').select(1);
    return this;
  }
}
