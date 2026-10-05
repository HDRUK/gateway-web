const FEATURE_FLAG = "V2_SearchAggregation";
const HDRUK_URL = "/search?type=datasets&q=asthma";
const ARDC_URL = "/search?type=datasets&dataSource=ARDC";

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

    it("sends dataSource=HDRUK in the aggregation search request by default", () => {
        cy.intercept("POST", "**/search/aggregation").as("aggregationSearch");
        cy.visit(HDRUK_URL);

        cy.wait("@aggregationSearch").then(({ request }) => {
            expect(request.body.dataSource).to.eq("HDRUK");
        });
    });

    it("sends dataSource=ARDC in the aggregation search request when viewing partner resources", () => {
        cy.intercept("POST", "**/search/aggregation").as("aggregationSearch");
        cy.visit(ARDC_URL);

        cy.wait("@aggregationSearch").then(({ request }) => {
            expect(request.body.dataSource).to.eq("ARDC");
        });
    });
});
