import { TagTypes } from "@/interfaces/Tag";
import { tagV1 } from "@/mocks/data";
import { createTag } from "@/services/tags";

describe("post", () => {
    it("should create tag", async () => {
        const payload = {
            type: "features" as TagTypes,
        };
        const response = await createTag(payload);
        expect(response).toEqual(tagV1);
    });
});
