import { formatYearRange } from "./formatYearRange";

jest.mock("@/utils/date", () => ({
    getYear: (input: string) => {
        const match = typeof input === "string" ? input.match(/\d{4}/) : null;
        return match ? match[0] : "";
    },
}));

describe("formatYearRange", () => {
    const FALLBACK = "n/a";

    it("returns 'start–end' when both valid and different", () => {
        expect(formatYearRange("2001-05-07", "2005-01-01", FALLBACK)).toBe(
            "2001–2005"
        );
    });

    it("returns single year when both valid and same", () => {
        expect(formatYearRange("2012-01-01", "2012-12-31", FALLBACK)).toBe(
            "2012"
        );
    });

    it("returns start year when only start is valid", () => {
        expect(formatYearRange("1999-07-09", null, FALLBACK)).toBe("1999");
        expect(formatYearRange("1999-07-09", "INVALID", FALLBACK)).toBe("1999");
    });

    it("returns end year when only end is valid", () => {
        expect(formatYearRange(undefined, "2020-03-03", FALLBACK)).toBe("2020");
        expect(formatYearRange("INVALID", "2020", FALLBACK)).toBe("2020");
    });

    it("returns fallback when neither is valid", () => {
        expect(formatYearRange(undefined, undefined, FALLBACK)).toBe(FALLBACK);
        expect(formatYearRange(null, null, FALLBACK)).toBe(FALLBACK);
        expect(formatYearRange("foo", "bar", FALLBACK)).toBe(FALLBACK);
    });

    it("delegates to getYear with the original inputs", () => {
        const spy = jest.spyOn(require("@/utils/date"), "getYear");
        formatYearRange("2010-10-10", "2011-01-01", FALLBACK);
        expect(spy).toHaveBeenCalledWith("2010-10-10");
        expect(spy).toHaveBeenCalledWith("2011-01-01");
    });
});
