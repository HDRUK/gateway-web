import { isDelimitedList, splitDelimitedList } from "./splitDelimitedList";

describe("isDelimitedList", () => {
    it("is true only for a string containing the delimiter", () => {
        expect(isDelimitedList("Primary care;,;GP")).toBe(true);
        expect(isDelimitedList("Primary care")).toBe(false);
        expect(isDelimitedList("a;b")).toBe(false);
        expect(isDelimitedList(["a", "b"])).toBe(false);
        expect(isDelimitedList(undefined)).toBe(false);
    });
});

describe("splitDelimitedList", () => {
    it("splits on the delimiter", () => {
        expect(splitDelimitedList("Primary care;,;GP;,;SAIL")).toEqual([
            "Primary care",
            "GP",
            "SAIL",
        ]);
    });

    it("trims each item and drops empties", () => {
        expect(splitDelimitedList(" GP ;,;;,; SAIL ")).toEqual(["GP", "SAIL"]);
    });

    it("keeps commas inside an item", () => {
        expect(splitDelimitedList("Smith, J;,;Jones, A")).toEqual([
            "Smith, J",
            "Jones, A",
        ]);
    });

    it("returns a single item when there is no delimiter", () => {
        expect(splitDelimitedList("Primary care")).toEqual(["Primary care"]);
    });
});
