import { generateMetadata } from "@/mocks/data/dataset";
import { getMetadataValue } from "./metadata";

const metadataItems = [
    generateMetadata(),
];

describe("Metadata utils", () => {
    it("should return metadata value", async () => {
        expect(getMetadataValue("properties/summary/title", generateMetadata())).toEqual(
            "title"
        );
    });
});
