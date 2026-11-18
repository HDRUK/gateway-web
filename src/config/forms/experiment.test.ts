import { experimentDefaultValues, experimentToPayload } from "./experiment";

describe("experimentToPayload", () => {
    it("sends start and end dates as calendar dates", () => {
        const payload = experimentToPayload({
            ...experimentDefaultValues,
            starts_at: new Date(2026, 10, 12) as unknown as string,
            ends_at: "2026-11-15T00:00:00.000Z",
        });

        expect(payload.starts_at).toBe("2026-11-12");
        expect(payload.ends_at).toBe("2026-11-15");
    });
});
