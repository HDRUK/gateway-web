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
        const mockUserRequest = {
            request_status: "APPROVED",
            request_expire_at: "07-07-2025 10:00:00",
        };

        (getUserCohortRequest as jest.Mock).mockResolvedValue(mockUserRequest);

        const result = await getCohortStatusAndRedirect(123);

        expect(getUserCohortRequest).toHaveBeenCalledWith("123");
        expect(result).toEqual({
            requestStatus: "APPROVED",
            nhseSdeRequestStatus: null,
            requestExpiry: "07-07-2025 10:00:00",
            redirectUrl: "",
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
            nhseSdeRequestStatus: null,
            requestExpiry: null,
            redirectUrl: "",
        });
    });
});
