const commonSelectors = {
  navbar: '#page-header',
};

type NavbarMainMenu = 'Resources';
type ResourcesDropdown = 'Blog';

export class CommonActions {
  static navigateToDropdownOption(mainMenu: NavbarMainMenu, dropdownOption: ResourcesDropdown) {
    cy.step(`navigate to ${dropdownOption} from ${mainMenu} menu`);
    cy.get(commonSelectors.navbar).within(() => {
      cy.contains(mainMenu).trigger('mouseover');
      cy.contains(dropdownOption).click({ force: true });
    });
  }

  static acceptCookies() {
    cy.step('accept cookies if present');
    cy.get('body').then(($body) => {
      if ($body.find('#hs-eu-confirmation-button').length > 0) {
        cy.get('#hs-eu-confirmation-button').click();
      }
    });
  }
}
