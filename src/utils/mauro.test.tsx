import { generateMauroItemV1 } from "@/mocks/data/dataset";
import { getMauroValue } from "./mauro";

const mauroItems = [
    generateMauroItemV1({
        value: "title",
        key: "properties/summary/title",
    }),
];

describe("Mauro utils", () => {
    it("should return mauro value", async () => {
        expect(getMauroValue("properties/summary/title", mauroItems)).toEqual(
            "title"
        );
    });
});
