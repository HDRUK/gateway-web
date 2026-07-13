/**
 * WIDGET EMBED CONTRACT
 *
 * Exercises the hosted widget page against the real API exactly as a
 * third-party site framing it would: same URL scheme, with and without a
 * cross-origin Referer header.
 */

const TEAM_ID = 21; // Cypress test users' team (TestDevUsersSeeder in gateway-api)
const EMBEDDER_ORIGIN = "http://localhost:8080"; // pretend third-party site
const WEB_ORIGIN = new URL(Cypress.config("baseUrl") as string).origin;

const apiV1 = () => `${Cypress.env("API_URL")}/api/v1`;

// The superuser bypasses team permission checks (CheckAccessMiddleware),
// so widget creation does not depend on seeded role-id → permission mappings.
const apiLogin = () =>
    cy
        .request("POST", `${apiV1()}/auth`, {
            email: Cypress.env("SUPERUSER_EMAIL"),
            password: Cypress.env("TEST_USER_PASSWORD"),
        })
        .its("body.access_token");

const createWidget = (token: string, permittedDomains: string[]) =>
    cy
        .request({
            method: "POST",
            url: `${apiV1()}/teams/${TEAM_ID}/widgets`,
            headers: { Authorization: `Bearer ${token}` },
            body: {
                widget_name: `Embed contract widget ${Date.now()}`,
                size_width: 400,
                size_height: 592,
                unit: "px",
                include_search_bar: true,
                include_cohort_link: true,
                keep_proportions: false,
                permitted_domains: permittedDomains,
            },
        })
        .then(response => {
            expect(
                response.status,
                "widget creation via the API (fails here = auth/permissions regression, not an embed regression)"
            ).to.eq(201);
            return cy.wrap<number>(response.body.data);
        });

const getHostedPage = (widgetId: number, referer?: string) =>
    cy.request({
        url: `${WEB_ORIGIN}/widgets/${TEAM_ID}-${widgetId}`,
        headers: referer ? { Referer: referer } : {},
    });

describe("Widget embed (hosted page contract against the real API)", () => {
    before(() => {
        cy.setFeatureFlag("Widgets", true);
    });

    it("serves the widget to a permitted embedding domain, without framing-blocking headers", () => {
        apiLogin().then(token => {
            createWidget(token, [EMBEDDER_ORIGIN]).then(widgetId => {
                getHostedPage(widgetId, `${EMBEDDER_ORIGIN}/`).then(
                    response => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.contain(
                            'data-testid="widget-display"'
                        );
                        expect(response.body).to.not.contain(
                            'data-testid="widget-error"'
                        );
                        expect(response.headers).to.not.have.property(
                            "x-frame-options"
                        );
                        const csp =
                            (response.headers["content-security-policy"] as
                                | string
                                | undefined) || "";
                        expect(csp).to.not.match(/frame-ancestors/i);
                    }
                );
            });
        });
    });

    it("shows the domain-not-permitted message for an unlisted embedding domain", () => {
        apiLogin().then(token => {
            createWidget(token, ["https://someone-else.example.com"]).then(
                widgetId => {
                    getHostedPage(widgetId, `${EMBEDDER_ORIGIN}/`).then(
                        response => {
                            expect(response.body).to.contain(
                                "is not in the list of permitted domains"
                            );
                        }
                    );
                }
            );
        });
    });

    it("refuses to render without a referer (direct browser tab access)", () => {
        apiLogin().then(token => {
            createWidget(token, [EMBEDDER_ORIGIN]).then(widgetId => {
                getHostedPage(widgetId).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.contain(
                        "cannot be viewed in a browser tab"
                    );
                });
            });
        });
    });
});
