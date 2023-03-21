import selectors from '../fixtures/user-journey-tabs-selectors.json';

/**
 * Gateway-web test automation
 * 
 * User journey - tabs
 * 
 * Simply completes a journey for each of the tab items to 
 * ensure that pages load correctly.
 */
describe('gateway web user journey - tabs', () => {
  beforeEach(() => {
    cy.loadLandingPage();
    cy.wait(2000);
    cy.get(selectors.main_page_loaded_compare)
      .contains(/^Showing [0-9]+ results$/);
  });

  it('can click Tools tab', () => {
    cy.get(selectors.journey_tools_tab).click();
    cy.get(selectors.tools_tab_loaded_compare)
      .contains('Tool');
  });

  it('can click Data uses tab', () => {
    cy.get(selectors.journey_data_uses_tab).click();
    cy.get(selectors.data_uses_tab_loaded_compare)
      .contains('Data use');
  });

  it('can click Collections tab', () => {
    cy.get(selectors.journey_collections_tab).click();
    cy.get(selectors.collections_tab_loaded_compare)
      .contains('Collection');
  });

  it('can click Courses tab', () => {
    cy.get(selectors.journey_courses_tab).click();
    cy.get(selectors.courses_tab_loaded_compare)
      .contains('Course');
  });

  it('can click Pages tab', () => {
    cy.get(selectors.journey_pages_tab).click();
    cy.get(selectors.pages_tab_loaded_compare)
      .contains('Paper');
  });

  it('can click People tab', () => {
    cy.get(selectors.journey_people_tab).click();
    cy.get(selectors.people_tab_loaded_compare)
      .contains(/^[A-Z|\d]{2}$/);
  });

  it('can click a dataset', () => {
    cy.get(selectors.dataset_link_container)
      .within(() => {
        cy.get('a').then((link) => {
          cy.request(link.prop('href'), { failOnStatusCode: true });
        });
      });
  });

  it('can click a tool', () => {
    cy.get(selectors.journey_tools_tab).click();
    cy.get(selectors.tool_link_container)
      .within(() => {
        cy.get('a').then((link) => {
          cy.request(link.prop('href'), { falseOnStatusCode: true });
        });
      });
  });

  it('can click a data use', () => {
    cy.get(selectors.journey_data_uses_tab).click();
    cy.get(selectors.data_uses_link_container)
      .within(() => {
        cy.get('a').then((link) => {
          cy.request(link.prop('href'), { falseOnStatusCode: true });
        });
      });
  });

  it('can click a collection', () => {
    cy.get(selectors.journey_collections_tab).click();
    cy.get(selectors.collection_link_container)
      .within(() => {
        cy.get('a').then((link) => {
          cy.request(link.prop('href'), { falseOnStatusCode: true });
        });
      });
  });

  it('can click a course', () => {
    cy.get(selectors.journey_courses_tab).click();
    cy.get(selectors.course_link_container)
      .within(() => {
        cy.get('a').then((link) => {
          cy.request(link.prop('href'), { falseOnStatusCode: true });
        });
      });
  });

  it('can click a page', () => {
    cy.get(selectors.journey_pages_tab).click();
    cy.get(selectors.page_link_container)
      .within(() => {
        cy.get('a').then((link) => {
          cy.request(link.prop('href'), { falseOnStatusCode: true });
        });
      });
  });

  it('can click a person', () => {
    cy.get(selectors.journey_people_tab).click();
    cy.get(selectors.people_link_container)
      .within(() => {
        cy.get('a').then((link) => {
          cy.request(link.prop('href'), { falseOnStatusCode: true });
        });
      });
  });
});
