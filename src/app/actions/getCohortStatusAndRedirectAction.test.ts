import { cookies } from "next/headers";
import { getUserCohortRequest, getCohortAccessRedirect } from "@/utils/api";
import { getCohortStatusAndRedirect } from "./getCohortStatusAndRedirectAction";

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

jest.mock("@/utils/api", () => ({
    getUserCohortRequest: jest.fn(),
    getCohortAccessRedirect: jest.fn(),
}));

describe("getCohortStatusAndRedirect", () => {
    const mockCookieStore = {
        get: jest.fn().mockReturnValue({ value: "fakeJWTToken" }),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockReturnValue(mockCookieStore);
    });

    it("should return correct cohort response when both API calls succeed", async () => {
        const mockUserRequest = { request_status: "APPROVED" };
        const mockAccessRedirect = {
            redirect_url: "https://example.com/redirect",
        };

        (getUserCohortRequest as jest.Mock).mockResolvedValue(mockUserRequest);
        (getCohortAccessRedirect as jest.Mock).mockResolvedValue(
            mockAccessRedirect
        );

        const result = await getCohortStatusAndRedirect(123);

        expect(cookies).toHaveBeenCalled();
        expect(getUserCohortRequest).toHaveBeenCalledWith(
            mockCookieStore,
            "123"
        );
        expect(getCohortAccessRedirect).toHaveBeenCalledWith(mockCookieStore);
        expect(result).toEqual({
            requestStatus: "APPROVED",
            redirectUrl: "https://example.com/redirect",
        });
    });

    it("should return null if one of the API calls fails", async () => {
        (getUserCohortRequest as jest.Mock).mockRejectedValue(
            new Error("API error")
        );
        (getCohortAccessRedirect as jest.Mock).mockResolvedValue({
            redirect_url: "url",
        });

        const result = await getCohortStatusAndRedirect(123);

        expect(result).toBeNull();
    });

    it("should handle missing request_status or redirect_url", async () => {
        (getUserCohortRequest as jest.Mock).mockResolvedValue({});
        (getCohortAccessRedirect as jest.Mock).mockResolvedValue({});

        const result = await getCohortStatusAndRedirect(123);

        expect(result).toEqual({
            requestStatus: null,
            redirectUrl: null,
        });
    });
});
