import selectors from '../fixtures/community-navigation-selectors.json';

/**
 * Gateway-web test automation
 * 
 * Navigation - community menu
 * 
 * Simply completes a journey for each of the community menu items to 
 * ensure that pages load correctly.
 */
describe('gateway web community navigation', () => {
  beforeEach(() => {
    cy.loadLandingPage();
    cy.get(selectors.main_nav_community_link).click();
  });

  it('can click about us > our mission and purpose', () => {
    cy.get(selectors.community_compare)
      .contains('Community forum');
  });
});
