import selectors from '../fixtures/help-navigation-selectors.json';

/**
 * Gateway-web test automation
 * 
 * Navigation - Help menu
 * 
 * Simply completes a journey for each of the Help menu items to 
 * ensure that pages load correctly.
 */
describe('gateway web help navigation', () => {
  beforeEach(() => {
    cy.loadLandingPage();
    cy.get(selectors.main_nav_help_link).click();
  });

  it('can click help > how to videos and guides', () => {
    cy.get(selectors.main_nav_help_tutorial_link).click();
    cy.wait(2000);
    cy.get(selectors.help_tutorials_compare)
      .contains('How-to videos and guides');
  });

  it('can click help > faqs', () => {
    cy.get(selectors.main_nav_help_faq_link).click();
    cy.wait(2000);
    cy.get(selectors.help_faqs_compare)
      .contains('The Gateway FAQs');
  });

  it('can click help > key terms glossary', () => {
    cy.get(selectors.main_nav_help_key_terms_link).click();
    cy.wait(2000);
    cy.get(selectors.help_key_terms_compare)
      .contains('explanation of some of the key terms used in the Gateway');
  });

  it('can click help > understanding hd access', () => {
    cy.get(selectors.main_nav_help_understanding_hd_access_link).click();
    cy.wait(2000);
    cy.get(selectors.help_understanding_hd_access_compare)
      .contains('Understanding Health Data Access- helpful resources');
  });

  it('can click help > contact us', () => {
    cy.get(selectors.main_nav_help_contact_us_link).click();
    cy.wait(2000);
    cy.get(selectors.help_contact_us_compare)
      .contains('For any issues, please contact Technical Support');
  });
});
