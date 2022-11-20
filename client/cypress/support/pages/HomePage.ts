export class HomePage {
  visit() {
    cy.visit('/home');
    return this;
  }

  clickUserDropdown() {
    cy.get('[data-testid="user-dropdown"]').click();
    return this;
  }

  clickSignout() {
    this.clickUserDropdown();
    cy.get('[data-testid="signout-button"]').click();
    return this;
  }

  clickLeaderBoardPageButton() {
    cy.get('[data-testid="go-to-leaderboard-button"]').click();
    return this; 
  }

  clickSeeMoreMessagesButton() {
    cy.get('[data-testid="see-more-messages-button"]').click();
    return this; 
  }
}
