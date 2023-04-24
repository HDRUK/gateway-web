import config from "@/config";
import { Tag, TagTypes } from "@/interfaces/Tag";
import { tagV1 } from "@/mocks/data";
import { postRequest } from "@/services/api";

describe("post", () => {
    it("should post payload", async () => {
        const payload = {
            type: "features" as TagTypes,
        };
        const response = await postRequest<Tag>(config.tagsV1Url, payload);
        expect(response).toEqual(tagV1);
    });
});
