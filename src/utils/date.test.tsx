import { formatDate } from "./date";

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
});
