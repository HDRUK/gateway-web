import config from "@/config";
import { Filter } from "@/interfaces/Filter";
import { filterV1, generateFilterV1 } from "@/mocks/data";
import { deleteRequest } from "@/services/api";

describe("delete", () => {
    it("should delete payload", async () => {
        const payload = generateFilterV1();
        const response = await deleteRequest<Filter>(
            `${config.filtersV1Url}/${payload.id}`
        );
        expect(response).toEqual(filterV1);
    });
});
