import { faker } from "@faker-js/faker";
import { RouteName } from "../../src/consts/routeName";

const PUBLICATION_NAME = "NEW_PUBLICATION";

const createPublication = () => {
    cy.visit(`/${RouteName.ACCOUNT}/${RouteName.PROFILE}`);
    cy.get('[href="/account/profile/publications"]').click();
    cy.contains("button", "Add publication").click();
    cy.contains("button", "Manually fill form").click();
    cy.get('input[name="paper_title"]').type(PUBLICATION_NAME);
    cy.get('input[name="authors"]').type(faker.random.alphaNumeric(5));
    cy.get('input[name="journal_name"]').type(faker.random.alphaNumeric(5));
    cy.get('input[name="year_of_publication"]').type(faker.random.numeric(4));
    cy.get('textarea[name="abstract"]').type(faker.random.alphaNumeric(10));
    cy.get('input[name="url"]').type("http://www.google.com");
    cy.get('[role="combobox"][aria-label="Relationship"]').click();
    cy.contains("li", "About the dataset").click();
    cy.get('input[name="datasets.0.id"]').click();
    cy.get('[role="listbox"] [role="option"]').first().click();
};

beforeEach(() => {
    cy.session("custodianTeamAdmin1", () => {
        cy.visit("/");
        cy.login("custodianTeamAdmin1");
    });
});

describe("Publication - creation", () => {
    it("should create a new active publication", () => {
        createPublication();
        cy.contains("button", "Publish").click();
        cy.contains("Publication successfully created");
    });
});

describe("Publication - search", () => {
    it("should be able to search for the publication", () => {
        cy.visit("/search?type=publications");
        cy.get("#query").type(`${PUBLICATION_NAME}{enter}`);
        cy.get("a").contains(PUBLICATION_NAME).click();
        cy.get("h2").contains(PUBLICATION_NAME);
    });
});

describe("Publication - draft", () => {
    it("should create a new draft publication", () => {
        cy.intercept(
            "POST",
            "http://localhost:8000/api/v2/users/34/publications"
        ).as("createPublication");

        createPublication();
        cy.contains("button", "Save as draft").click();

        cy.wait("@createPublication").then(({ response }) => {
            expect(response?.statusCode).to.be.oneOf([200, 201]);

            const id = response?.body?.data;
            expect(id, "created publication id").to.exist;

            cy.location("pathname").should(
                "eq",
                `/en/account/profile/publications`
            );

            cy.visit(`/${RouteName.EN}/${RouteName.PUBLICATION}/${id}`, {
                failOnStatusCode: false,
            });

            cy.contains("Oops!").should("exist");
        });
    });
});
