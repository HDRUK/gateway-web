import { sessionHeader } from "@/config/session";
import { getFilters, getKeywords, getSchemaFromTraser } from "./api";

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

    it.each([
        ["filters", () => getFilters()],
        ["schema", () => getSchemaFromTraser("HDRUK", "4.0.0")],
    ])("fetches %s without user headers", async (_, request) => {
        await request();

        expect(requestHeaders()).not.toHaveProperty("Authorization");
        expect(requestHeaders()).not.toHaveProperty(sessionHeader);
    });

    it("sends user headers by default", async () => {
        await getKeywords();

        expect(requestHeaders()).toMatchObject({
            Authorization: "Bearer jwt-token",
            [sessionHeader]: expect.stringContaining("session-1"),
        });
    });

    it("caches filters for fifteen minutes", async () => {
        await getFilters();

        expect(fetchSpy.mock.calls[0][1].next).toEqual({
            tags: ["filters", "all"],
            revalidate: 900,
        });
    });
});
