/**
 * @jest-environment node
 */
import { cookies } from "next/headers";
import config from "@/config/config";
import { sessionCookie } from "@/config/session";

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

// jest-fetch-mock (jest.setup.js) swaps in a Response without the static json() NextResponse needs
const fetchPrimitives = jest.requireActual(
    "next/dist/compiled/@edge-runtime/primitives"
);
Object.assign(global, {
    Response: fetchPrimitives.Response,
    Headers: fetchPrimitives.Headers,
    Request: fetchPrimitives.Request,
});

const GET = async () => (await import("./route")).GET();

const unsignedJwt = (payload: Record<string, unknown>) =>
    [
        Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
            "base64url"
        ),
        Buffer.from(JSON.stringify(payload)).toString("base64url"),
        "signature",
    ].join(".");

const unexpiredToken = unsignedJwt({
    user: { id: 1, name: "Jane Doe" },
    exp: Math.floor(Date.now() / 1000) + 3600,
});

const givenCookies = (values: Record<string, string>) => {
    (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) =>
            values[name] === undefined ? undefined : { value: values[name] },
    });
};

const givenApiResponds = (status: number, body: unknown) => {
    global.fetch = jest.fn().mockResolvedValue(
        new Response(JSON.stringify(body), { status })
    ) as typeof fetch;
};

describe("GET /api/auth", () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it("reports signed out and expires the token cookie when the API no longer accepts the token", async () => {
        givenCookies({ [sessionCookie]: "session-1", [config.JWT_COOKIE]: unexpiredToken });
        givenApiResponds(401, { message: "Session is no longer active" });

        const response = await GET();

        expect(await response.json()).toEqual({ data: { isLoggedIn: false } });
        expect(response.headers.get("set-cookie")).toMatch(
            new RegExp(`^${config.JWT_COOKIE}=;.*Expires=Thu, 01 Jan 1970`)
        );
    });

    it("reports signed in with the profile when the API accepts the token", async () => {
        givenCookies({ [sessionCookie]: "session-1", [config.JWT_COOKIE]: unexpiredToken });
        givenApiResponds(200, { data: { id: 1, name: "Jane Doe" } });

        const response = await GET();
        const body = await response.json();

        expect(body.data.isLoggedIn).toBe(true);
        expect(body.data.user).toEqual({ id: 1, name: "Jane Doe" });
        expect(response.headers.get("set-cookie")).toBeNull();
    });

    it("reports signed out without calling the API when there is no token", async () => {
        givenCookies({ [sessionCookie]: "session-1" });
        givenApiResponds(200, {});

        const response = await GET();

        expect(await response.json()).toEqual({ data: { isLoggedIn: false } });
    });
});
