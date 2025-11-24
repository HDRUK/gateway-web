import * as dateUtils from "@/utils/date";
import { formatYearRange } from "./formatYearRange";

jest.mock("@/utils/date", () => ({
    getYear: jest.fn((input: string) => {
        const match = typeof input === "string" ? input.match(/\d{4}/) : null;
        return match ? match[0] : "";
    }),
}));

describe("formatYearRange", () => {
    const FALLBACK = "n/a";

    it("delegates to getYear with the original inputs", () => {
        formatYearRange("2010-10-10", "2011-01-01", FALLBACK);
        expect(dateUtils.getYear).toHaveBeenCalledWith("2010-10-10");
        expect(dateUtils.getYear).toHaveBeenCalledWith("2011-01-01");
    });
});
