const FEATURE_FLAG = "V2/Search/Aggregation";
const HDRUK_URL = "/search?type=datasets&q=asthma";
const ARDC_URL = "/search?type=datasets&dataSource=ARDC";

// TODO: unskip once backend renames feature flag to remove '/' from "V2/Search/Aggregation"
describe.skip("Search - ARDC external sources", () => {
    before(() => {
        cy.setFeatureFlag(FEATURE_FLAG, true);
    });

    after(() => {
        cy.setFeatureFlag(FEATURE_FLAG, false);
    });
    it("shows PartnerResourcesBanner on the HDRUK tab when ARDC has results", () => {
        cy.waitForApiIdle();
        cy.visit(HDRUK_URL);

        cy.contains("Partner resources").should("exist");
        cy.contains("button", "View partner resources").should("exist");
    });

    it("renders ARDC result cards when dataSource=ARDC", () => {
        cy.waitForApiIdle();
        cy.visit(ARDC_URL);

        cy.get("a[href*='researchdata.edu.au']").should(
            "have.length.greaterThan",
            0
        );
    });
});
