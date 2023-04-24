import { FilterTypes } from "@/interfaces/Filter";
import { filterV1 } from "@/mocks/data";
import { createFilter } from "@/services/filters";

describe("post", () => {
    it("should create filter", async () => {
        const payload = {
            type: "features" as FilterTypes,
        };
        const response = await createFilter(payload);
        expect(response).toEqual(filterV1);
    });
});
