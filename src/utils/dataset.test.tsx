import {
    formatYearStat,
    hasValidValue,
    parseLeadTime,
    splitStringList,
} from "./dataset";

describe("Dataset utils", () => {
    describe("parseLeadTime", () => {
        it("should return formatted lead time", async () => {
            expect(parseLeadTime("1-2 WEEKS")).toEqual(["1-2", "WEEKS"]);
        });
        it("should return empty lead time", async () => {
            expect(parseLeadTime("")).toEqual([]);
        });
        it("should return string if lead time unit not matched", async () => {
            expect(parseLeadTime("1-2 YEARS")).toEqual(["1-2 YEARS"]);
        });
    });

    describe("splitStringList", () => {
        it("should split string list", async () => {
            expect(splitStringList("ONE,TWO")).toEqual(["ONE", "TWO"]);
        });
        it("should return value if no comma found", async () => {
            expect(splitStringList("ONE")).toEqual(["ONE"]);
        });
    });

    describe("hasValidValue", () => {
        it("should confirm a valid value", async () => {
            expect(hasValidValue("VALUE")).toEqual(true);
        });
        it("should confirm an invalid value of undefined", async () => {
            expect(hasValidValue("undefined")).toEqual(false);
        });
        it("should confirm an invalid value of null", async () => {
            expect(hasValidValue("null")).toEqual(false);
        });
    });

    describe("formatYearStat", () => {
        it("should format a year stat", async () => {
            expect(formatYearStat("2022", "2023")).toEqual("2022 - 2023");
        });
        it("should format a year stat with no end year", async () => {
            expect(formatYearStat("2022")).toEqual("2022");
        });
        it("should format a year stat with no start year", async () => {
            expect(formatYearStat("", "2023")).toEqual("2023");
        });
    });
});
