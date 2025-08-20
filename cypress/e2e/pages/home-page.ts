import { ApiPage } from "./api-page";
import { CommonActions } from "./common-actions";

export class HomePage {
  static visitHomePage() {
    cy.step("visit home page");
    ApiPage.interceptPointrMapsFonts();
    cy.visit("/");
    CommonActions.acceptCookies();
    
    cy.wait(`@${ApiPage.getAliases().POINTR_MAPS_FONTS}`, { timeout: 10000 });
  }
}
