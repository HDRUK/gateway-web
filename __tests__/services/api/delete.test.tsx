import config from "@/config";
import { generateNumber } from "@/mocks/data/generic";
import { deleteRequest } from "@/services/api";

describe("delete", () => {
    it("should return delete payload", async () => {
        const response = await deleteRequest(
            `${config.filtersV1Url}/${generateNumber()}`
        );
        expect(response).toEqual({ message: "success" });
    });
});
