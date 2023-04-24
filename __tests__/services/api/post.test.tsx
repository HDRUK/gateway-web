import config from "@/config";
import { Tag } from "@/interfaces/Tag";
import { tagsV1 } from "@/mocks/data";
import { postRequest } from "@/services/api";

describe("post", () => {
    it("should create tags", async () => {
        const payload = {
            foo: "bar",
        };
        const response = await postRequest<Tag[]>(config.tagsV1Url, payload);
        expect(response).toEqual(tagsV1);
    });
});
