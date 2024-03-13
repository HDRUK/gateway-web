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
                query: "diabetes",
                sort: "desc",
                page: "",
                per_page: "",
                type: "datasets",
            };

            const response = pickOnlyFilters("datasets", query);

            expect(response).toEqual({
                filters: {
                    datasets: {
                        publisherName: ["one"],
                        geographicLocation: [],
                        dataUseTitles: [],
                    },
                },
            });
        });
    });
});
