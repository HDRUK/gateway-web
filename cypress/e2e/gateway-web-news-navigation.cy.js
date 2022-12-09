import selectors from '../fixtures/news-navigation-selectors.json';

/**
 * Gateway-web test automation
 * 
 * Navigation - news menu
 * 
 * Simply completes a journey for each of the news menu items to 
 * ensure that pages load correctly.
 */
describe('gateway web news navigation', () => {
  beforeEach(() => {
    cy.loadLandingPage();
    cy.get(selectors.main_nav_news_link).click();
  });

  it('can click about us > our mission and purpose', () => {
    cy.get(selectors.news_compare)
      .contains('Latest news');
  });
});
