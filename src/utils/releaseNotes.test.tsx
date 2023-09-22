import { ReleaseNode } from "@/interfaces/Releases";
import { getReleaseByYear } from "./releaseNotes";

describe("ReleaseNotes utils", () => {
    const releases: ReleaseNode[] = [
        {
            node: {
                id: "1",
                title: "Release 1",
                date: "2023-01-15",
                content: "Release 1 content",
            },
        },
        {
            node: {
                id: "2",
                title: "Release 2",
                date: "2023-02-20",
                content: "Release 2 content",
            },
        },
        {
            node: {
                id: "3",
                title: "Release 3",
                date: "2022-12-10",
                content: "Release 3 content",
            },
        },
    ];

    it("should filter releases by year", () => {
        const year = "2023";
        const result = getReleaseByYear(releases, year);

        expect(result).toEqual([
            {
                id: "1",
                title: "Release 1",
                date: "2023-01-15",
                content: "Release 1 content",
            },
            {
                id: "2",
                title: "Release 2",
                date: "2023-02-20",
                content: "Release 2 content",
            },
        ]);
    });

    it("should handle empty releases array", () => {
        const year = "2021";
        const result = getReleaseByYear([], year);

        expect(result).toEqual([]);
    });

    it("should handle non-matching year", () => {
        const year = "2024";
        const result = getReleaseByYear(releases, year);

        expect(result).toEqual([]);
    });
});
