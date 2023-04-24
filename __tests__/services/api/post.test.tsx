import config from "@/config";
import { Filter, FilterTypes } from "@/interfaces/Filter";
import { filterV1 } from "@/mocks/data";
import { postRequest } from "@/services/api";

describe("post", () => {
    it("should post payload", async () => {
        const payload = {
            type: "features" as FilterTypes,
        };
        const response = await postRequest<Filter>(
            config.filtersV1Url,
            payload
        );
        expect(response).toEqual(filterV1);
    });
});
