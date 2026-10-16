import "./commands";
import { getTokenClaims } from "./utils/tokenClaims";

afterEach(function () {
    const test = this.currentTest;

    if (!test || test.state !== "failed") {
        return;
    }

    cy.url().then(url => {
        cy.getCookies().then(cookies => {
            const token = cookies.find(({ name }) => name === "token");

            cy.writeFile(
                `cypress/screenshots/auth/${Cypress.spec.name} -- ${test.title}.json`,
                {
                    now: Math.floor(Date.now() / 1000),
                    url,
                    lastLogin: Cypress.env("lastLogin") || null,
                    token: token ? getTokenClaims(token.value) : null,
                    cookies: cookies.map(
                        ({ name, domain, path, expiry, sameSite, secure }) => ({
                            name,
                            domain,
                            path,
                            expiry,
                            sameSite,
                            secure,
                        })
                    ),
                }
            );
        });
    });
});

Cypress.on("uncaught:exception", err => {
    const msg = err?.message ?? "";
    if (
        msg.includes("Failed to execute 'measure' on 'Performance'") &&
        msg.includes("NotFound") &&
        msg.includes("negative time stamp")
    ) {
        return false;
    }
    return true;
});
