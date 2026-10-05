import { datasetSearchResultV1 } from "../../../mocks/data/dataset/v1/dataset.data";

const FEATURE_FLAG = "V2_SearchAggregation";
const PER_PAGE = 25;
const NEXT = 'button[aria-label="Go to next page"]';

const stubAggregation = (total: number) =>
    cy
        .intercept("POST", "**/search/aggregation", req => {
            const page = Number(req.body.page ?? 1);
            const start = (page - 1) * PER_PAGE;
            const hits = Array.from(
                { length: Math.max(0, Math.min(PER_PAGE, total - start)) },
                (_, i) => ({
                    ...datasetSearchResultV1,
                    _id: `${start + i + 1}`,
                })
            );

            req.reply({
                message: "success",
                data: {
                    query: "",
                    type: "datasets",
                    results: {
                        HDRUK: {
                            source: "typesense",
                            provider_logo: null,
                            about: null,
                            hits,
                            total,
                            aggregations: [],
                            ids: hits.map(hit => hit._id),
                        },
                    },
                },
            });
        })
        .as("aggregationSearch");

const visitPage = (page: number) => {
    cy.visit(`/search?type=datasets&page=${page}`);
    cy.wait("@aggregationSearch");
};

describe("Search - pagination", () => {
    let flagWasEnabled = false;

    before(() => {
        cy.request(`${Cypress.env("API_URL")}/api/v1/features`).then(
            ({ body }) => {
                flagWasEnabled = !!body.data[FEATURE_FLAG];
            }
        );
        cy.setFeatureFlag(FEATURE_FLAG, true);
    });

    after(() => {
        cy.setFeatureFlag(FEATURE_FLAG, flagWasEnabled);
    });

    describe("10 pages of results", () => {
        beforeEach(() => stubAggregation(250));

        it("enables next before the last page", () => {
            visitPage(9);
            cy.get(NEXT).should("not.be.disabled");
        });

        it("disables next on the last page", () => {
            visitPage(10);
            cy.get('button[aria-label="page 10"]').should("exist");
            cy.get('button[aria-label="Go to page 11"]').should("not.exist");
            cy.get(NEXT).should("be.disabled");
        });

        it("shows only the current page's results", () => {
            visitPage(2);
            cy.get('a[href$="dataset/26"]').should("exist");
            cy.get('a[href$="dataset/50"]').should("exist");
            cy.get('a[href$="dataset/25"]').should("not.exist");
            cy.get('a[href$="dataset/51"]').should("not.exist");
        });
    });

    [
        { total: 25, lastPage: 1 },
        { total: 50, lastPage: 2 },
        { total: 75, lastPage: 3 },
        { total: 100, lastPage: 4 },
    ].forEach(({ total, lastPage }) => {
        it(`disables next on page ${lastPage} with exactly ${total} results`, () => {
            stubAggregation(total);
            visitPage(lastPage);
            cy.get(NEXT).should("be.disabled");
            cy.get(`button[aria-label="Go to page ${lastPage + 1}"]`).should(
                "not.exist"
            );
        });
    });
});
