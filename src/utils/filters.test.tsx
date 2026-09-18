import { SearchCategory, SearchQueryParams } from "@/interfaces/Search";
import { generateFilterV1 } from "@/mocks/data";
import {
    formatBucketCounts,
    groupByType,
    isQueryEmpty,
    pickOnlyFilters,
} from "./filters";

describe("Filter utils", () => {
    it("should filters by filter type", async () => {
        const filters = [
            generateFilterV1({ type: "course" }),
            generateFilterV1({ type: "course" }),
            generateFilterV1({ type: "dataset" }),
        ];
        expect(groupByType(filters, "dataset")).toEqual([
            {
                buckets: undefined,
                label: filters[2].keys,
                value: filters[2].id.toString(),
            },
        ]);
    });
    describe("formatBucketCounts", () => {
        it("should format bucket counts", () => {
            const aggregations = [
                {
                    doc_count: 100,
                    key: "England",
                },
            ];

            const response = formatBucketCounts(aggregations);

            expect(response).toEqual({
                England: 100,
            });
        });
    });
    describe("isQueryEmpty", () => {
        it("should return true if empty", () => {
            const query = {
                one: undefined,
                two: [],
                there: [],
            };

            const response = isQueryEmpty(query);

            expect(response).toBe(true);
        });
        it("should return false if has a nested property", () => {
            const query = {
                one: undefined,
                two: ["aValue"],
                there: [],
            };

            const response = isQueryEmpty(query);

            expect(response).toBe(false);
        });
    });
    describe("pickOnlyFilters", () => {
        it("should return filters only", () => {
            const query = {
                publisherName: ["one"],
                geographicLocation: [],
                dataUseTitles: [],
                organisationName: [],
                datasetTitles: [],
                dateRange: [],
                query: "diabetes",
                sort: "desc",
                page: "",
                per_page: "",
                type: SearchCategory.DATASETS,
            };

            const response = pickOnlyFilters("datasets", query);

            expect(response).toEqual({
                filters: {
                    datasets: {
                        datasetTitles: [],
                        publisherName: ["one"],
                        geographicLocation: [],
                        organisationName: [],
                        dataUseTitles: [],
                        dateRange: [],
                    },
                },
            });
        });

        describe("populationSize", () => {
            const getPopulationSize = (populationSize: string[] = []) => {
                const query = {
                    publisherName: ["one"],
                    populationSize,
                    query: "diabetes",
                    sort: "desc",
                    page: "",
                    per_page: "",
                    type: SearchCategory.DATASETS,
                } as SearchQueryParams;

                return pickOnlyFilters("dataset", query).filters?.dataset
                    ?.populationSize;
            };

            it("should include unreported populations by default", () => {
                expect(getPopulationSize()).toEqual({
                    from: undefined,
                    to: undefined,
                    includeUnreported: true,
                });
            });

            it("should exclude unreported populations from zero when no range is set", () => {
                expect(getPopulationSize(["excludeUnreported"])).toEqual({
                    from: "0",
                    to: undefined,
                    includeUnreported: false,
                });
            });

            it("should keep the range when unreported populations are included", () => {
                expect(getPopulationSize(["1000", "5000"])).toEqual({
                    from: "1000",
                    to: "5000",
                    includeUnreported: true,
                });
            });

            it("should keep the range when unreported populations are excluded", () => {
                expect(
                    getPopulationSize(["1000", "5000", "excludeUnreported"])
                ).toEqual({
                    from: "1000",
                    to: "5000",
                    includeUnreported: false,
                });
            });

            it("should read the range regardless of where the exclusion sits", () => {
                expect(
                    getPopulationSize(["excludeUnreported", "1000", "5000"])
                ).toEqual({
                    from: "1000",
                    to: "5000",
                    includeUnreported: false,
                });
            });
        });
    });
});
