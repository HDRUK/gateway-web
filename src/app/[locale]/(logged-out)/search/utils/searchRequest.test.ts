import apis from "@/config/apis";
import { parseQueryParams } from "./queryParams";
import {
    getArdcSearchUrl,
    getExportRequest,
    getPmcDatasetNames,
    getSearchMode,
    getV1SearchBody,
    getV1SearchUrl,
    getV2SearchBody,
    isEuropePmcSearchNoQuery,
    shouldFetchV1,
} from "./searchRequest";

const params = (query: string) => parseQueryParams(new URLSearchParams(query));

describe("searchRequest utils", () => {
    describe("getSearchMode", () => {
        it.each([
            ["type=datasets", true, false],
            ["type=tools", false, true],
            ["type=publications", false, true],
            ["type=publications&source=FED", false, false],
        ])(
            "%s uses external %s and typesense %s",
            (query, externalSearchEnabled, isTypesenseSearch) => {
                expect(getSearchMode(params(query))).toMatchObject({
                    externalSearchEnabled,
                    isTypesenseSearch,
                });
            }
        );

        it("selects the external source from the url", () => {
            expect(
                getSearchMode(params("type=datasets&dataSource=ARDC"))
                    .isExternalSourceSelected
            ).toBe(true);
        });
    });

    describe("shouldFetchV1", () => {
        it.each([
            ["type=datasets", false, false],
            ["type=tools", false, false],
            ["type=publications", false, false],
            ["type=publications&source=FED", false, false],
            ["type=publications&source=FED&query=asthma", false, true],
            ["type=publications&source=FED", true, true],
        ])("%s forced %s fetches %s", (query, force, expected) => {
            const queryParams = params(query);
            expect(
                shouldFetchV1(queryParams, getSearchMode(queryParams), force)
            ).toBe(expected);
        });
    });

    describe("getV1SearchUrl", () => {
        it("adds the source for publications", () => {
            expect(getV1SearchUrl(params("type=publications&source=FED"))).toBe(
                `${apis.searchV1Url}/publications?per_page=25&page=1&sort=score:desc&source=FED`
            );
        });
    });

    describe("request bodies", () => {
        it("builds the v1 body for europe pmc", () => {
            expect(
                getV1SearchBody(params("type=publications&source=FED&query=a"))
            ).toEqual({ query: "a" });
        });

        it("builds the v2 body with view_type for datasets only", () => {
            const v2Body = (query: string) =>
                getV2SearchBody(params(query), getSearchMode(params(query)));

            expect(v2Body("type=datasets")).toMatchObject({
                type: "datasets",
                view_type: "mini",
            });
            expect(v2Body("type=tools")).not.toHaveProperty("view_type");
        });
    });

    describe("getExportRequest", () => {
        it("exports the current search from the v2 export endpoint", () => {
            expect(
                getExportRequest(params("type=tools&query=nlp"), "list")
            ).toEqual({
                url: `${apis.searchV2Url}/tools/export`,
                body: { query: "nlp", download_type: "list" },
            });
        });

        it("carries the active filters and results view", () => {
            const queryParams = params(
                "type=datasets&publisherName=Publisher%20A"
            );

            expect(getExportRequest(queryParams, "table").body).toMatchObject({
                download_type: "table",
                filters: { dataset: { publisherName: ["Publisher A"] } },
            });
        });
    });

    describe("europe pmc", () => {
        it.each([
            ["type=publications&source=FED", true],
            ["type=publications&source=FED&query=a", false],
            ["type=publications&source=GAT", false],
        ])("%s has no query %s", (query, expected) => {
            expect(isEuropePmcSearchNoQuery(params(query))).toBe(expected);
        });

        it.each([
            ["source=FED&pmc=dataset&query=a|b", ["a", "b"]],
            ["source=FED&query=a|b", undefined],
            ["source=GAT&pmc=dataset&query=a|b", undefined],
        ])("%s gives dataset names %o", (query, expected) => {
            expect(
                getPmcDatasetNames(params(`type=publications&${query}`))
            ).toEqual(expected);
        });
    });

    describe("getArdcSearchUrl", () => {
        it("encodes the query", () => {
            expect(getArdcSearchUrl("heart & lung")).toBe(
                "https://researchdata.edu.au/health/search?filter-type=all-fields&q=heart%20%26%20lung"
            );
        });

        it("omits the query when empty", () => {
            expect(getArdcSearchUrl("")).toBe(
                "https://researchdata.edu.au/health/search?filter-type=all-fields"
            );
        });
    });
});
