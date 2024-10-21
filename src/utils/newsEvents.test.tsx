import { EventNode } from "@/interfaces/Events";
import { generateEventNode } from "@/mocks/data/cms/v1/cms.data";
import { getNewsEventsByYear } from "./newsEvents";

jest.useFakeTimers().setSystemTime(new Date("2024-01-01"));

const mockedEvents: EventNode[] = [
    generateEventNode("2024-01-01", "1"),
    generateEventNode("2024-01-02", "2"),
    generateEventNode("2025-01-03", "3"),
];

describe("NewsEvents utils", () => {
    it("should filter events by year", () => {
        const result = getNewsEventsByYear(mockedEvents, "2024");

        expect(result).toEqual([mockedEvents[0].node, mockedEvents[1].node]);
    });

    it("should handle empty events array", () => {
        const result = getNewsEventsByYear([], "2024");

        expect(result).toEqual([]);
    });

    it("should handle non-matching year", () => {
        const result = getNewsEventsByYear(mockedEvents, "2023");

        expect(result).toEqual([]);
    });
});
