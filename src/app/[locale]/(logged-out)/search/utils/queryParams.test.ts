import { SearchCategory } from "@/interfaces/Search";
import {
    getHasSearched,
    getRemoveFilterPatch,
    parseQueryParams,
} from "./queryParams";

describe("queryParams utils", () => {
    describe("parseQueryParams", () => {
        it("applies defaults when there are no params", () => {
            expect(parseQueryParams(null)).toMatchObject({
                query: "",
                sort: "score:desc",
                page: "1",
                per_page: "25",
                type: SearchCategory.DATASETS,
                source: "GAT",
                dataSource: "HDRUK",
            });
        });

        it("parses pipe-delimited array params", () => {
            expect(
                parseQueryParams(
                    new URLSearchParams({
                        publisherName: "NHS|UKHSA|Genomics England",
                    })
                ).publisherName
            ).toEqual(["NHS", "UKHSA", "Genomics England"]);
        });

        it("filters empty strings from array params by default", () => {
            expect(
                parseQueryParams(
                    new URLSearchParams({ publisherName: "NHS||UKHSA" })
                ).publisherName
            ).toEqual(["NHS", "UKHSA"]);
        });

        it("preserves empty strings for date range params", () => {
            expect(
                parseQueryParams(new URLSearchParams({ dateRange: "2020|" }))
                    .dateRange
            ).toEqual(["2020", ""]);
        });
    });

    describe("getHasSearched", () => {
        it.each([
            ["type=datasets", false],
            ["type=datasets&view=list", false],
            ["type=datasets&query=", false],
            ["type=datasets&query=asthma", true],
            ["type=datasets&page=2", true],
        ])("%s is %s", (params, expected) => {
            expect(getHasSearched(new URLSearchParams(params))).toBe(expected);
        });
    });

    describe("getRemoveFilterPatch", () => {
        const queryParams = parseQueryParams(
            new URLSearchParams({
                dataType: "Health|Imaging",
                dataSubType: "MRI",
                dateRange: "2010|2020",
                populationSize: "100|5000|excludeUnreported",
            })
        );

        it("returns undefined for a non-array filter", () => {
            expect(
                getRemoveFilterPatch(queryParams, "query", "asthma")
            ).toBeUndefined();
        });

        it("clears the sub type when removing a data type", () => {
            expect(
                getRemoveFilterPatch(queryParams, "dataType", "Health")
            ).toEqual({ dataType: ["Imaging"], dataSubType: undefined });
        });

        it("blanks the value in a date range", () => {
            expect(
                getRemoveFilterPatch(queryParams, "dateRange", "2010")
            ).toEqual({ dateRange: ["", "2020"] });
        });

        it("blanks the value in a population range", () => {
            expect(
                getRemoveFilterPatch(queryParams, "populationSize", "100")
            ).toEqual({
                populationSize: ["", "5000", "excludeUnreported"],
            });
        });

        it("removes the unreported exclusion from a population range", () => {
            expect(
                getRemoveFilterPatch(
                    queryParams,
                    "populationSize",
                    "excludeUnreported"
                )
            ).toEqual({ populationSize: ["100", "5000"] });
        });
    });
});
