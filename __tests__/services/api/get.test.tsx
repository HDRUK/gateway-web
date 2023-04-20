import config from "@/config";
import { Tag } from "@/interfaces/Tag";
import { tagsV1 } from "@/mocks/data";
import { getRequest } from "@/services/api";

describe("get", () => {
    it("should return tags", async () => {
        const response = await getRequest<Tag[]>(config.tagsV1Url);
        expect(response).toEqual(tagsV1);
    });
});
