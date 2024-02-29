import { FilterType } from "@/interfaces/Filter";
import { generateFilterV1 } from "@/mocks/data";
import {
    convertFilterTypesToObj,
    formatBucketCounts,
    groupByType,
    removeEmptyRootObjects,
} from "./filters";

describe("Filter utils", () => {
    const filterSections: FilterType[] = ["collection", "dataUseRegister"];
    it("should return filter object with value assigned", async () => {
        expect(convertFilterTypesToObj(filterSections, true)).toEqual({
            collection: true,
            dataUseRegister: true,
        });
    });
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
    describe("removeEmptyRootObjects", () => {
        it("should remove undefined properties from nested objects", () => {
            const obj = {
                dataset: {
                    dataUseTitles: undefined,
                    publisherName: undefined,
                },
                other: {
                    dataUseTitles: ["one"],
                    publisherName: undefined,
                },
            };

            const response = removeEmptyRootObjects(obj);

            expect(response).toEqual({
                other: {
                    dataUseTitles: ["one"],
                },
            });
        });
        it("should remove entire objects", () => {
            const obj = {
                filters: {
                    dataset: {
                        dataUseTitles: undefined,
                        publisherName: undefined,
                    },
                    other: {
                        publisherName: undefined,
                    },
                },
            };

            const response = removeEmptyRootObjects(obj);

            expect(response).toEqual({});
        });
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
});
