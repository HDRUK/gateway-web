import { faker } from "@faker-js/faker";

const NAME = "NEW_DATASET";

const clickNextButton = () => cy.contains("button", "Next").click();

const navigateToDatasetCreation = () => {
    cy.visit("http://localhost:3000/account/team/21/team-management");
    cy.contains("a", "Datasets").click();
    cy.contains("button", "Add new dataset").click();
    cy.contains("button", "Manually input metadata").click();
};

const completeDatasetForm = () => {
    cy.get('input[type="checkbox"][name="Health and disease"]').check();
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
    cy.get('[role="combobox"][aria-label="Publishing frequency"]').click();
    cy.get('[role="listbox"] [role="option"]').first().click();

    cy.get('[data-testid="Start\\ date-date"]').within(() => {
        cy.get('span[role="spinbutton"][aria-label="Day"]')
            .click()
            .type("12032026");
    });

    cy.get('[role="combobox"][aria-label="Time lag"]').click();
    cy.get('[role="listbox"] [role="option"]').first().click();
    clickNextButton();

    cy.get('[name="Data use limitation"] input').click();
    cy.get('[role="listbox"] [role="option"]').eq(1).click();
    cy.get('[name="Data use limitation"] [aria-label="Clear"]').click();
    cy.wait(1000);
    cy.get('[name="Data use limitation"] input').click();
    cy.get('[role="listbox"] [role="option"]').first().click();
    cy.wait(1000);
    cy.get('[name="Controlled vocabulary"]').click();
    cy.get('[role="listbox"] [role="option"]').first().click();
    cy.wait(1000);
    cy.scrollTo(0);
    cy.wait(1000);

    cy.get('[name="Alignment with standardised data models"]').click();
    cy.get('[role="listbox"] [role="option"]').first().click();
    clickNextButton();
    clickNextButton();
    clickNextButton();
};

beforeEach(() => {
    cy.session("darManagerAndMetadatamanger", () => {
        cy.visit("/");
        cy.login("darManagerAndMetadatamanger");
    });
});

describe("Dataset - creation", () => {
    it("should create a new active dataset", () => {
        navigateToDatasetCreation();
        completeDatasetForm();
        cy.contains("button", "Make active").click();
        cy.contains("Dataset successfully created");
    });
});

describe("Dataset - missing fields", () => {
    it("should highlight missing dataset fields", () => {
        navigateToDatasetCreation();
        cy.contains("button", "Make active").click();
        cy.contains("There are some missing fields");
    });
});
