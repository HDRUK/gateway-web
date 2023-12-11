import { formatDate, differenceInDays } from "./date";

describe("Date utils", () => {
    it("should return default formatted date", async () => {
        expect(formatDate(new Date("2023-09-15T09:33:01.000000Z"))).toBe(
            "15 September 2023"
        );
    });
    it("should return custom formatted date", async () => {
        expect(
            formatDate(new Date("2023-09-15T09:33:01.000000Z"), "dd/MM/yy")
        ).toBe("15/09/23");
    });

    it("should calculate the difference in days between two dates", async () => {
        expect(
            differenceInDays(new Date("2022-01-10"), new Date("2022-01-01"))
        ).toBe(9);
    });
});
