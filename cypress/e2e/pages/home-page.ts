const homePageSelectors = {
  plusButton: '[data-testid="JP"]',
  accountButton: '[data-testid="LGST"]',
};

export class HomePage {
  static visitHomePage() {
    cy.allure().logStep("visit home page");
    cy.visit("/");
  }

  static verifyHomePageElements() {
    cy.allure().logStep("verify home page elements");
    cy.get(homePageSelectors.plusButton).should("be.visible");
    cy.get(homePageSelectors.accountButton).should("be.visible");
  }
}
