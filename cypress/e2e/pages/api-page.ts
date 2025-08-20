const FONT_BASE_URL = 'https://pointrmapstorage.blob.core.windows.net/style/8.7.5/fonts';
const FONT_ID_PATTERN = '.*';
const FONT_ICONS_URL = `${FONT_BASE_URL}/PointrMapsIcons/${FONT_ID_PATTERN}\\.pbf`;

const LINKEDIN_ADS_PATTERN = 'https://px\\.ads\\.linkedin\\.com/.*';

const apiAliases = {
  POINTR_MAPS_FONTS: 'pointrMapsFonts',
  LINKEDIN_ADS: 'linkedinAds'
};

export class ApiPage {
  static interceptPointrMapsFonts() {
    return cy.intercept('GET', new RegExp(FONT_ICONS_URL)).as(apiAliases.POINTR_MAPS_FONTS);
  }

  static interceptLinkedInAds() {
    return cy.intercept('GET', new RegExp(LINKEDIN_ADS_PATTERN)).as(apiAliases.LINKEDIN_ADS);
  }

  static getAliases() {
    return apiAliases;
  }
}
