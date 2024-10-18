import { ReleaseNode } from "@/interfaces/Releases";
import { generateReleaseNode } from "@/mocks/data/cms/v1/cms.data";
import { getReleaseByYear } from "./releaseNotes";

jest.useFakeTimers().setSystemTime(new Date("2024-01-01"));

const mockedReleases: ReleaseNode[] = [
    generateReleaseNode("2024-01-15", "1"),
    generateReleaseNode("2024-02-20", "2"),
    generateReleaseNode("2023-12-10", "3"),
];

describe("ReleaseNotes utils", () => {
    it("should filter releases by year", () => {
        const result = getReleaseByYear(mockedReleases, "2024");

        expect(result).toEqual([
            mockedReleases[0].node,
            mockedReleases[1].node,
        ]);
    });

    it("should handle empty releases array", () => {
        const result = getReleaseByYear([], "2024");

        expect(result).toEqual([]);
    });

    it("should handle non-matching year", () => {
        const result = getReleaseByYear(mockedReleases, "2025");

        expect(result).toEqual([]);
    });
});
