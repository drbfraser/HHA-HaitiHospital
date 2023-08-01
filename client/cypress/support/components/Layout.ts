export class LayoutComponent {
  clickBackButton() {
    cy.get('[data-testid="back-button"]').click();
    return this;
  }
}
