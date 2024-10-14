import { EventNode } from "@/interfaces/Events";
import { mockedEventNode } from "@/mocks/data/newsEvents";
import { getNewsEventsByYear } from "./newsEvents";

jest.useFakeTimers().setSystemTime(new Date("2024-01-01"));

const mockedArgs: EventNode[] = [
    mockedEventNode("2024-01-01", "1"),
    mockedEventNode("2024-01-02", "2"),
    mockedEventNode("2025-01-03", "3"),
];

describe("NewsEvents utils", () => {
    it("should filter events by year", () => {
        const result = getNewsEventsByYear(mockedArgs, "2024");

        expect(result).toEqual([mockedArgs[0].node, mockedArgs[1].node]);
    });

    it("should handle empty events array", () => {
        const result = getNewsEventsByYear([], "2024");

        expect(result).toEqual([]);
    });

    it("should handle non-matching year", () => {
        const result = getNewsEventsByYear(mockedArgs, "2023");

        expect(result).toEqual([]);
    });
});
