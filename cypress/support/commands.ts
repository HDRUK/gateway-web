import "cypress-axe";
import { getUserForLogin } from "./utils/getUserForLogin";

const API_URL = Cypress.env("API_URL") + "/api/v1/auth";

Cypress.Commands.add("checkA11yPage", () => {
    cy.injectAxe(); // injects axe-core into the page
    cy.checkA11y(); // runs accessibility checks
});

Cypress.Commands.add("login", (user: string) => {
    cy.get("header").within(() => {
        cy.contains("button", "Sign in").should("exist");
    });
    const prefix = getUserForLogin(user);

    const username = Cypress.env(prefix + "EMAIL");
    const password = Cypress.env("TEST_USER_PASSWORD");

    cy.request({
        method: "POST",
        url: API_URL,
        body: {
            email: username,
            password: password,
        },
    }).then(response => {
        expect(response.status).to.eq(200);
        const jwt = response.body.access_token;
        cy.setCookie("token", jwt);
        cy.reload();
    });
});

Cypress.Commands.add("waitForApiIdle", () => {
    let pending = 0;

    cy.intercept(
        { method: "GET", url: `${Cypress.env("API_URL")}/**` },
        req => {
            pending++;
            req.continue(() => {
                pending--;
            });
        }
    );

    cy.wrap(null, { timeout: 10000 }).should(() => expect(pending).to.equal(0));
});

declare global {
    namespace Cypress {
        interface Chainable {
            checkA11yPage: () => void;
            login: (user: string) => void;
            waitForApiIdle: () => void;
        }
    }
}
