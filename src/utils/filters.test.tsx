import { FilterType } from "@/interfaces/Filter";
import { generateFilterV1 } from "@/mocks/data";
import { convertFilterTypesToObj, groupByType } from "./filters";

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
});
