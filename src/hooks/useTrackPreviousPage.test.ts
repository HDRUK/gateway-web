import { usePathname, useSearchParams } from "next/navigation";
import {
    useTrackPreviousPage,
    getPreviousPage,
} from "@/hooks/useTrackPreviousPage";
import { renderHook } from "@/utils/testUtils";

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
}));

describe("useTrackPreviousPage", () => {
    beforeEach(() => {
        sessionStorage.clear();
        jest.clearAllMocks();
    });

    it("should set currentPage in sessionStorage", () => {
        (usePathname as jest.Mock).mockReturnValue("/page1");
        (useSearchParams as jest.Mock).mockReturnValue({
            toString: () => "",
        });

        renderHook(() => useTrackPreviousPage());

        expect(sessionStorage.getItem("currentPage")).toBe("/page1");
    });

    it("should update previousPage when navigating", () => {
        sessionStorage.setItem("currentPage", "/page1");

        (usePathname as jest.Mock).mockReturnValue("/page2");
        (useSearchParams as jest.Mock).mockReturnValue({
            toString: () => "",
        });

        renderHook(() => useTrackPreviousPage());

        expect(sessionStorage.getItem("previousPage")).toBe("/page1");
        expect(sessionStorage.getItem("currentPage")).toBe("/page2");
    });

    it("getPreviousPage should return previous page", () => {
        sessionStorage.setItem("previousPage", "/pageX");

        expect(getPreviousPage()).toBe("/pageX");
    });

    it("getPreviousPage should return null if none set", () => {
        expect(getPreviousPage()).toBeNull();
    });
});
