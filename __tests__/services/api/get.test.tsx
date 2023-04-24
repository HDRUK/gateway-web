import config from "@/config";
import { Filter } from "@/interfaces/Filter";
import { filtersV1 } from "@/mocks/data";
import { getRequest } from "@/services/api";

describe("get", () => {
    it("should return filters", async () => {
        const response = await getRequest<Filter[]>(config.filtersV1Url);
        expect(response).toEqual(filtersV1);
    });
});
