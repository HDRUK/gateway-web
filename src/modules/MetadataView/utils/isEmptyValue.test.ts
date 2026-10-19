import { isEmptyValue } from "./isEmptyValue";

describe("isEmptyValue", () => {
    it("treats false and 0 as answers", () => {
        expect(isEmptyValue(false)).toBe(false);
        expect(isEmptyValue(true)).toBe(false);
        expect(isEmptyValue(0)).toBe(false);
    });

    it("treats the -1 sentinel as not reported", () => {
        expect(isEmptyValue(-1)).toBe(true);
    });

    it("treats absences as empty", () => {
        expect(isEmptyValue(null)).toBe(true);
        expect(isEmptyValue(undefined)).toBe(true);
        expect(isEmptyValue("")).toBe(true);
        expect(isEmptyValue([])).toBe(true);
        expect(isEmptyValue({})).toBe(true);
    });

    it("keeps non-empty values", () => {
        expect(isEmptyValue("GP")).toBe(false);
        expect(isEmptyValue(42)).toBe(false);
        expect(isEmptyValue(["a"])).toBe(false);
        expect(isEmptyValue({ a: 1 })).toBe(false);
    });
});
