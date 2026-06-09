/**
 * Requires the `V2/Search/Aggregation` Pennant feature flag to be active
 * in the test environment.
 */

const SEARCH_URL = "/search?type=datasets&q=health";
const VIEW_PARTNER_RESOURCES_BTN = "View partner resources";
const PARTNER_RESOURCES_TEXT = "Partner resources";

describe("Search - ARDC external sources", () => {
    beforeEach(() => {
        cy.visit(SEARCH_URL);
        cy.waitForApiIdle();
    });

    it("shows PartnerResourcesBanner on HDRUK tab when ARDC has results", () => {
        cy.contains(PARTNER_RESOURCES_TEXT).should("exist");
        cy.contains("button", VIEW_PARTNER_RESOURCES_BTN).should("exist");
    });

    it("switches to ARDC results and renders result cards when 'View partner resources' is clicked", () => {
        cy.contains("button", VIEW_PARTNER_RESOURCES_BTN).click();
        cy.waitForApiIdle();

        cy.get("a[href*='researchdata.edu.au']").should(
            "have.length.greaterThan",
            0
        );
    });

    it("navigating to page 2 updates the displayed results", () => {
        cy.contains("button", VIEW_PARTNER_RESOURCES_BTN).click();
        cy.waitForApiIdle();

        cy.get("button[aria-label='Go to page 2']").click();
        cy.waitForApiIdle();

        cy.url().should("include", "page=2");
        cy.get("a[href*='researchdata.edu.au']").should(
            "have.length.greaterThan",
            0
        );
    });
});
