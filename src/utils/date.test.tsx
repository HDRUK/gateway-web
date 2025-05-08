import {
    formatDate,
    differenceInDays,
    yearToDayJsDate,
    getTZDate,
} from "./date";

describe("Date utils", () => {
    it("should return default formatted date", async () => {
        expect(formatDate("2023-09-15T09:33:01.000000Z")).toBe("15 Sep 2023");
    });
    it("should return custom formatted date", async () => {
        expect(formatDate("2023-09-15T09:33:01.000000Z", "DD/MM/YY")).toBe(
            "15/09/23"
        );
    });
    it("should return custom formatted date, year first", async () => {
        expect(formatDate("2023-09-15T09:33:01.000000Z", "YYYY-MM-DD")).toBe(
            "2023-09-15"
        );
    });

    it("should return custom formatted date, including hours and mins", async () => {
        expect(
            formatDate("2023-09-15T09:33:01.000000Z", "DD MMMM YYYY HH:mm")
        ).toBe("15 September 2023 09:33");
    });

    it("should calculate the difference in days between two dates", async () => {
        expect(differenceInDays("2022-01-10", "2022-01-01")).toBe(9);
    });

    it("should return full date for a year", async () => {
        expect(yearToDayJsDate("2022").format()).toEqual(
            "2022-01-01T00:00:00+00:00"
        );
    });

    it("should return utc date with no timezone specified", async () => {
        expect(getTZDate("2022-04-01").format()).toEqual(
            "2022-04-01T00:00:00Z"
        );
    });

    it("should return tz date with timezone specified", async () => {
        expect(getTZDate("2022-04-01", "Europe/London").format()).toEqual(
            "2022-04-01T01:00:00+01:00"
        );
    });
});
