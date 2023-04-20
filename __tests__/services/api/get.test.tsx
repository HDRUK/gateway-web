import config from "@/config";
import { tagsV1 } from "@/mocks/data";
import { apiService } from "@/services";

describe("get", () => {
    it("should return tags", async () => {
        const response = await apiService.getRequest(config.tagsV1Url);
        expect(response).toEqual(tagsV1.data);
    });
});
