import { parseLeadTime, splitStringList } from "./dataset";

describe("Dataset utils", () => {
    it("should return formatted lead time", async () => {
        expect(parseLeadTime("1-2 WEEKS")).toEqual(["1-2", "WEEKS"]);
    });
    it("should return empty lead time", async () => {
        expect(parseLeadTime("")).toEqual([]);
    });
    it("should return string if lead time unit not matched", async () => {
        expect(parseLeadTime("1-2 YEARS")).toEqual(["1-2 YEARS"]);
    });
    it("should split string list", async () => {
        expect(splitStringList("ONE,TWO")).toEqual(["ONE", "TWO"]);
    });
});
