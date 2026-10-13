/**
 * @jest-environment node
 */
import { cookies } from "next/headers";
import config from "@/config/config";

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

describe("GET /api/logout", () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it.each([200, 401])(
        "expires the token cookie whatever the API answers (%i)",
        async status => {
            (cookies as jest.Mock).mockResolvedValue({
                get: (name: string) =>
                    name === config.JWT_COOKIE ? { value: "a-token" } : undefined,
            });
            global.fetch = jest
                .fn()
                .mockResolvedValue(new Response("{}", { status })) as typeof fetch;

            const response = await GET();

            expect(response.status).toBe(200);
            expect(response.headers.get("set-cookie")).toMatch(
                new RegExp(`^${config.JWT_COOKIE}=;.*Expires=Thu, 01 Jan 1970`)
            );
        }
    );
});
