import selectors from '../fixtures/explore-navigation-selectors.json';

/**
 * Gateway-web test automation
 * 
 * Navigation - Explore menu
 * 
 * Simply completes a journey for each of the Explore menu items to 
 * ensure that pages load correctly.
 */
describe('gateway web explore navigation', () => {
  beforeEach(() => {
    cy.loadLandingPage();
    cy.get(selectors.main_nav_explore_link).click();
  });

  it('can click explore > Datasets navigation item', () => {
    cy.get(selectors.main_nav_explore_datasets_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_dataset_compare)
      .contains('Metadata last updated:');
  });

  it('can click explore > Tools navigation item', () => {
    cy.get(selectors.main_nav_explore_tools_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_tools_compare)
      .contains('Tool');
  });

  it('can click explore > Data use navigation item', () => {
    cy.get(selectors.main_nav_explore_data_uses_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_datause_compare)
      .contains('Data use');
  });

  it('can click explore > Papers navigation item', () => {
    cy.get(selectors.main_nav_explore_papers_link).click();
    cy.wait(10000);
    cy.get(selectors.explore_papers_compare)
      .contains('Paper');
  });

  it('can click explore > Courses navigation item', () => {
    cy.get(selectors.main_nav_explore_courses_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_courses_compare)
      .contains('Course');
  });

  it('can click explore > People navigation item', () => {
    cy.get(selectors.main_nav_explore_people_link).click();
    cy.wait(2000);
    cy.get(selectors.people_1st_link).click();
    cy.contains('ORCID');
  });

  it('can click explore > Cohorts discovery item', () => {
    cy.get(selectors.main_nav_explore_cohorts_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_cohorts_compare)
      .contains('Cohort Discovery Search Tool');
  });

  it('can click explore > collections > malaria item', () => {
    cy.get(selectors.main_nav_explore_collections_malaria_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_collections_malaria_compare)
      .contains('Malaria Collection');
  });

  it('can click explore > collections > breast cancer item', () => {
    cy.get(selectors.main_nav_explore_collections_breast_cancer_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_collections_breast_cancer_compare)
      .contains('Breast Cancer');    
  });

  it('can click explore > collections > epilepsy item', () => {
    cy.get(selectors.main_nav_explore_collections_epilepsy_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_collections_epilepsy_compare)
      .contains('Collection of resources relating to epilepsy');
  });

  it('can click explore > collections > osteoporosis item', () => {
    cy.get(selectors.main_nav_explore_collections_osteoporosis_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_collections_osteoporosis_compare)
      .contains('Osteoporosis');
  });

  it('can click explore > collections > SARS item', () => {
    cy.get(selectors.main_nav_explore_collections_sars_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_collections_sars_compare)
      .contains('SARS Collection');
  });

  it('can click explore > collections > bacteria item', () => {
    cy.get(selectors.main_nav_explore_collections_bacteria_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_collections_bacteria_compare)
      .contains('Bacteria Collection');
  });

  it('can click explore > collections > CDC item', () => {
    cy.get(selectors.main_nav_explore_collections_cdc_link).click();
    cy.wait(2000);
    cy.get(selectors.explore_collections_cdc_compare)
      .contains('CDC Collection');
  });
});
