import { clearCookieAction } from "./clearCookieAction";

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

describe("clearCookieAction", () => {
    it("should clear the specified cookie by setting maxAge: 0", async () => {
        const setMock = jest.fn();

        const { cookies } = await import("next/headers");

        (cookies as jest.Mock).mockReturnValue({
            set: setMock,
        });

        await clearCookieAction("dar-update-suppress");

        expect(setMock).toHaveBeenCalledWith("dar-update-suppress", "", {
            maxAge: 0,
        });
    });
});
