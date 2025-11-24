import { formatPopulationSize } from "./formatPopulationSize";

describe("formatPopulationSize", () => {
    const FALLBACK = "not reported";

    it("formats positive numbers with default locale", () => {
        expect(formatPopulationSize(1234567, FALLBACK)).toBe(
            (1234567).toLocaleString()
        );
    });

    it("formats positive numbers with a provided locale", () => {
        expect(formatPopulationSize(1234567, FALLBACK, "en-GB")).toBe(
            "1,234,567"
        );
        // German uses dots for thousands
        expect(formatPopulationSize(1234567, FALLBACK, "de-DE")).toBe(
            "1.234.567"
        );
    });

    it("parses numeric strings", () => {
        expect(formatPopulationSize("987654", FALLBACK, "en-GB")).toBe(
            "987,654"
        );
    });

    it("trims and parses numeric strings with whitespace", () => {
        expect(formatPopulationSize("   4200  ", FALLBACK, "en-GB")).toBe(
            "4,200"
        );
    });

    it("returns fallback for empty string", () => {
        expect(formatPopulationSize("", FALLBACK)).toBe(FALLBACK);
        expect(formatPopulationSize("   ", FALLBACK)).toBe(FALLBACK);
    });

    it("returns fallback for non-numeric string", () => {
        expect(formatPopulationSize("abc", FALLBACK)).toBe(FALLBACK);
    });

    it("returns fallback for zero or negative values", () => {
        expect(formatPopulationSize(0, FALLBACK)).toBe(FALLBACK);
        expect(formatPopulationSize(-10, FALLBACK)).toBe(FALLBACK);
        expect(formatPopulationSize("-1", FALLBACK)).toBe(FALLBACK);
    });

    it("returns fallback for undefined, null, or NaN", () => {
        expect(formatPopulationSize(undefined, FALLBACK)).toBe(FALLBACK);
        expect(formatPopulationSize(null, FALLBACK)).toBe(FALLBACK);
        expect(formatPopulationSize(NaN, FALLBACK)).toBe(FALLBACK);
    });
});
