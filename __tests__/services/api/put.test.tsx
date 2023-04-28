import config from "@/config";
import { Filter, FilterType } from "@/interfaces/Filter";
import { filterV1, generateFilterV1 } from "@/mocks/data";
import { server } from "@/mocks/server";
import { putRequest } from "@/services/api";

describe("put", () => {
    it("should put payload", async () => {
        const payload = generateFilterV1();
        const response = await putRequest<Filter>(
            `${config.filtersV1Url}/${payload.id}`,
            payload
        );
        expect(response).toEqual(filterV1);
    });
});
