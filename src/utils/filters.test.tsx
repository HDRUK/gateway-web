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
        expect(groupByType(filters)).toEqual({
            course: [
                { label: filters[0].value, value: filters[0].id.toString() },
                { label: filters[1].value, value: filters[1].id.toString() },
            ],
            dataset: [
                { label: filters[2].value, value: filters[2].id.toString() },
            ],
        });
    });
});
