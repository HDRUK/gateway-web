import { generateFilterV1 } from "@/mocks/data";
import { formatBucketCounts, groupByType } from "./filters";

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
});
