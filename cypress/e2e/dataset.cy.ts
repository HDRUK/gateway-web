import { faker } from "@faker-js/faker";

const NAME = "NEW_DATASET";

const clickNextButton = () => cy.contains("button", "Next").click();

const navigateToDatasetCreation = () => {
    cy.visit("/account/team/21/team-management");
    cy.contains("a", "Datasets").click();
    cy.contains("button", "Add new dataset").click();
    cy.contains("button", "Manually input metadata").click();
};

const selectOption = (opener: () => void, optionIndex = 0) => {
    opener();
    cy.get('[role="listbox"] [role="option"]').should(
        "have.length.greaterThan",
        0
    );
    cy.get('[role="listbox"] [role="option"]').eq(optionIndex).click();
};

const completeDatasetForm = () => {
    cy.get('input[type="checkbox"][name="Health and disease"]').check();
    cy.waitForApiIdle();
    clickNextButton();
    cy.get("input#Title").type(NAME);
    cy.get('textarea[name="Dataset abstract"]').type(
        faker.random.alphaNumeric(5)
    );
    clickNextButton();
    cy.get('textarea[name="Description"]').type(faker.random.alphaNumeric(5));
    clickNextButton();
    cy.get('input[name="Geographic coverage"]').type("GB");
    clickNextButton();
    selectOption(() =>
        cy.get('[role="combobox"][aria-label="Publishing frequency"]').click()
    );
    cy.get('[data-testid="Start\\ date-date"]').within(() => {
        cy.get('span[role="spinbutton"][aria-label="Day"]')
            .click()
            .type("12032026");
    });
    selectOption(() =>
        cy.get('[role="combobox"][aria-label="Time lag"]').click()
    );
    clickNextButton();
    selectOption(() => cy.get('[name="Data use limitation"] input').click(), 1);
    cy.get('[name="Data use limitation"] [aria-label="Clear"]').click();
    selectOption(() => cy.get('[name="Data use limitation"] input').click());
    cy.get('textarea[name="Access rights"]').type(faker.random.alphaNumeric(5));
    selectOption(() => cy.get('[name="Controlled vocabulary"]').click());

    selectOption(() =>
        cy.get('[name="Alignment with standardised data models"]').click()
    );
    cy.get('[name="Format"]')
        .click()
        .type(faker.random.alphaNumeric(5))
        .type("{enter}");
};

beforeEach(() => {
    cy.session("darManagerAndMetadatamanger", () => {
        cy.visit("/");
        cy.login("darManagerAndMetadatamanger");
    });
});

describe("Dataset - creation", () => {
    it("should create a new active dataset", () => {
        cy.intercept("POST", "**/teams/*/datasets*").as("createDataset");

        navigateToDatasetCreation();
        completeDatasetForm();
        cy.contains("button", "Make active").click();

        cy.contains("There are some missing fields").should("not.exist");

        cy.wait("@createDataset")
            .its("response.statusCode")
            .should("be.oneOf", [200, 201]);

        cy.contains("Dataset successfully created", { timeout: 15000 });
    });
});

describe("Dataset - missing fields", () => {
    it("should highlight missing dataset fields", () => {
        navigateToDatasetCreation();
        cy.contains("button", "Make active").click();
        cy.contains("There are some missing fields");
    });
});
