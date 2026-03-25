describe("Gateway homepage", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("displays the correct title and tagline", () => {
        cy.get("main").within(() => {
            cy.get("h1").within(() => {
                cy.contains("Welcome to the Gateway").should("exist");
            });
            cy.contains(
                "The Gateway streamlines the end-to-end user journey to search, discover and request access to the wealth of health and associated Datasets, Analysis Scripts & Software, Publications and Research Projects from across the UK and beyond."
            ).should("exist");
        });
    });

    it("content changes when hovering button", () => {
        cy.get('[href="/search?type=datasets"]').focus();

        cy.get("main").within(() => {
            cy.get("h1").within(() => {
                cy.contains("Datasets & BioSamples").should("exist");
            });
            cy.contains(
                "Explore Datasets & BioSamples from across the UK and beyond and then navigate their associated content, such as, metadata, data provenance, and demographics or Gateway entities, such as, linked Datasets, Publications, and Analysis Scripts & Software."
            ).should("exist");
        });
    });

    // it("should have no detectable accessibility violations on load", () => {
    //     cy.visit("/");
    //     cy.injectAxe();
    //     cy.checkA11y();
    // });
});
