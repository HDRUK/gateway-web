import selectors from '../fixtures/usage-navigation-selectors.json';

/**
 * Gateway-web test automation
 * 
 * Navigation - Usage menu
 * 
 * Simply completes a journey for each of the Usage menu items to 
 * ensure that pages load correctly.
 */
describe('gateway web usage navigation', () => {
  beforeEach(() => {
    cy.loadLandingPage();
    cy.get(selectors.main_nav_usage_link).click();
  });

  it('can click usage > general activity', () => {
    cy.get(selectors.main_nav_usage_general_activity_link).click();
    cy.wait(2000);
    cy.get(selectors.usage_general_activity_compare)
      .contains('A collection of statistics, metrics and analytics');
  });

  it('can click usage > national core', () => {
    cy.get(selectors.main_nav_usage_national_core_link).click();
    cy.wait(2000);
    cy.get(selectors.usage_national_core_compare)
      .contains('National Core Studies');
  });

  it('can click usage > gateway releases', () => {
    cy.get(selectors.main_nav_usage_gateway_releases_link).click();
    cy.wait(2000);
    cy.get(selectors.usage_gateway_releases_link)
      .contains('The Gateway requires a significant volume of design and development');
  });
});
