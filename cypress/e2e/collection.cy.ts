import { faker } from "@faker-js/faker";
import { RouteName } from "../../src/consts/routeName";

const NAME = "NEW_COLLECTION";

const createCollection = () => {
    cy.visit(`/${RouteName.ACCOUNT}/${RouteName.PROFILE}`);
    cy.get('[href="/account/profile/collections"]').click();
    cy.contains("button", "Add new Collection").click();
    cy.get('input[name="name"]').type(NAME);
    cy.get('[name="collaborators"] input').type(faker.random.alphaNumeric(5));
};

beforeEach(() => {
    cy.session("custodianTeamAdmin1", () => {
        cy.visit("/");
        cy.login("custodianTeamAdmin1");
    });
});

describe("Collection - creation", () => {
    it("should create a new active collection", () => {
        createCollection();
        cy.contains("button", "Publish").click();
        cy.contains("Collection successfully created");
    });
});

describe("Collection - search", () => {
    it("should be able to search for the collection", () => {
        cy.visit("/search?type=collections");
        cy.get("#query").type(`${NAME}{enter}`);
        cy.get("a").contains(NAME).click();
        cy.get("h1").contains(NAME);
    });
});

describe("Collection - draft", () => {
    it("should create a new draft collection", () => {
        cy.intercept(
            "POST",
            "http://localhost:8000/api/v2/users/34/collections"
        ).as("createCollection");

        createCollection();
        cy.contains("button", "Save as draft").click();

        cy.wait("@createCollection").then(({ response }) => {
            expect(response?.statusCode).to.be.oneOf([200, 201]);

            const id = response?.body?.data;
            expect(id, "created collection id").to.exist;

            cy.location("pathname").should(
                "eq",
                `/en/account/profile/collections`
            );

            cy.visit(`/${RouteName.EN}/${RouteName.COLLECTION_ITEM}/${id}`, {
                failOnStatusCode: false,
            });

            cy.contains("Oops!").should("exist");
        });
    });
});
