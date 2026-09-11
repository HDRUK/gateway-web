import { countTagsWithinRows } from "./utils";

describe("countTagsWithinRows", () => {
    const rowsOf = (...counts: number[]) =>
        counts.flatMap((count, row) => Array<number>(count).fill(row * 28));

    it("should return every tag when there are fewer rows than the maximum", () => {
        expect(countTagsWithinRows(rowsOf(6, 6, 3), 5)).toBe(15);
    });

    it("should return every tag when the rows exactly meet the maximum", () => {
        expect(countTagsWithinRows(rowsOf(6, 6, 6, 6, 4), 5)).toBe(28);
    });

    it("should reserve a slot for the toggle when the rows overflow", () => {
        expect(countTagsWithinRows(rowsOf(6, 6, 6, 6, 6, 6), 5)).toBe(29);
    });

    it("should count by row membership rather than dividing by a row size", () => {
        expect(countTagsWithinRows(rowsOf(2, 9, 1, 7, 4, 3), 5)).toBe(22);
    });

    it("should keep at least one tag when a single row overflows", () => {
        expect(countTagsWithinRows(rowsOf(1, 1), 1)).toBe(1);
    });

    it("should handle having no tags", () => {
        expect(countTagsWithinRows([], 5)).toBe(0);
    });
});
