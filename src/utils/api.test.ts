import { sessionHeader } from "@/config/session";
import { getFilters } from "./api";

jest.mock("next/headers", () => ({
    cookies: jest.fn(async () => ({ get: () => ({ value: "jwt-token" }) })),
}));

jest.mock("./getSessionCookie", () => ({
    getSessionCookie: jest.fn(async () => "session-1"),
}));

const fetchSpy = jest.fn();

const requestHeaders = () =>
    fetchSpy.mock.calls[0][1].headers as Record<string, string>;

describe("api", () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        fetchSpy.mockReset();
        fetchSpy.mockResolvedValue({
            ok: true,
            json: async () => ({ data: [] }),
        });
        global.fetch = fetchSpy;
    });

    afterAll(() => {
        global.fetch = originalFetch;
    });

    it("fetches filters without user headers", async () => {
        await getFilters();

        expect(requestHeaders()).not.toHaveProperty("Authorization");
        expect(requestHeaders()).not.toHaveProperty(sessionHeader);
    });

    it("caches filters for fifteen minutes", async () => {
        await getFilters();

        expect(fetchSpy.mock.calls[0][1].next).toEqual({
            tags: ["filters", "all"],
            revalidate: 900,
        });
    });
});
