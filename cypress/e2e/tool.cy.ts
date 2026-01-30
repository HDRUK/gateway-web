import { faker } from "@faker-js/faker";
import { RouteName } from "../../src/consts/routeName";

const TOOL_NAME = "NEW_TOOL";

const createTool = () => {
    cy.visit(`/en/${RouteName.ACCOUNT}/${RouteName.PROFILE}`);
    cy.get('[href="/account/profile/tools"]').click();
    cy.contains("button", "Add new").click();

    cy.get('input[name="name"]').type(TOOL_NAME);
    cy.get('textarea[name="description"]').type(faker.random.alphaNumeric(50));
    cy.get('textarea[name="results_insights"]').type(
        faker.random.alphaNumeric(50)
    );
    cy.get('input[name="associated_authors"]').type(
        faker.random.alphaNumeric(5)
    );
};

describe("Analysis Scripts & Software - creation", () => {
    beforeEach(() => {
        cy.visit("/en");
        cy.login("custodianTeamAdmin1");
    });

    it("should create a new active tool", () => {
        createTool();
        cy.contains("button", "Publish").click();
    });
});

describe("Analysis Scripts & Software - search", () => {
    it("should be able to search for the tool", () => {
        cy.visit(`/en`);
        cy.get("a").contains("Analysis Scripts & Software").click();
        cy.get("#query").type(`${TOOL_NAME}{enter}`);
        cy.get("a").contains(TOOL_NAME).click();
        cy.get("h2").contains(TOOL_NAME);
    });
});

describe("Analysis Scripts & Software - draft", () => {
    beforeEach(() => {
        cy.visit("/en");
        cy.login("custodianTeamAdmin1");
    });

    it("should create a new active tool", () => {
        cy.intercept("POST", "http://localhost:8000/api/v2/users/34/tools").as(
            "createTool"
        );

        createTool();
        cy.contains("button", "Save as draft").click();

        cy.wait("@createTool").then(({ response }) => {
            expect(response?.statusCode).to.be.oneOf([200, 201]);

            const body = response?.body;
            const id = body.data;

            expect(id, "created tool id").to.exist;

            cy.location("pathname").should("eq", `/en/account/profile/tools`);

            cy.visit(`/${RouteName.EN}/${RouteName.TOOL_ITEM}/${id}`, {
                failOnStatusCode: false,
            });

            cy.contains("Oops!").should("exist");
        });
    });
});
