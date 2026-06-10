import { act } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { renderHook } from "@/utils/testUtils";
import { SearchCategory } from "@/interfaces/Search";
import { HDRUK_SOURCE_VALUE } from "@/consts/search";
import { useQueryParams } from "./useQueryParams";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();

const makeSearchParams = (params: Record<string, string> = {}) =>
    new URLSearchParams(params);

beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue("/en/search");
    (useSearchParams as jest.Mock).mockReturnValue(makeSearchParams());
});

describe("useQueryParams", () => {
    describe("initialisation", () => {
        it("uses defaults when URL has no params", () => {
            const { result } = renderHook(() => useQueryParams());
            expect(result.current.queryParams.type).toBe(SearchCategory.DATASETS);
            expect(result.current.queryParams.page).toBe("1");
            expect(result.current.queryParams.per_page).toBe("25");
            expect(result.current.queryParams.query).toBe("");
            expect(result.current.queryParams.dataSource).toBe(HDRUK_SOURCE_VALUE);
        });

        it("reads query, sort, page and type from URL params", () => {
            (useSearchParams as jest.Mock).mockReturnValue(
                makeSearchParams({
                    query: "cancer",
                    sort: "popularity",
                    page: "3",
                    type: SearchCategory.TOOLS,
                })
            );
            const { result } = renderHook(() => useQueryParams());
            expect(result.current.queryParams.query).toBe("cancer");
            expect(result.current.queryParams.sort).toBe("popularity");
            expect(result.current.queryParams.page).toBe("3");
            expect(result.current.queryParams.type).toBe(SearchCategory.TOOLS);
        });

        it("parses pipe-delimited array params", () => {
            (useSearchParams as jest.Mock).mockReturnValue(
                makeSearchParams({ publisherName: "NHS|UKHSA|Genomics England" })
            );
            const { result } = renderHook(() => useQueryParams());
            expect(result.current.queryParams.publisherName).toEqual([
                "NHS",
                "UKHSA",
                "Genomics England",
            ]);
        });

        it("filters empty strings from array params by default", () => {
            (useSearchParams as jest.Mock).mockReturnValue(
                makeSearchParams({ publisherName: "NHS||UKHSA" })
            );
            const { result } = renderHook(() => useQueryParams());
            expect(result.current.queryParams.publisherName).toEqual([
                "NHS",
                "UKHSA",
            ]);
        });

        it("preserves empty strings for date range params", () => {
            (useSearchParams as jest.Mock).mockReturnValue(
                makeSearchParams({ dateRange: "2020|" })
            );
            const { result } = renderHook(() => useQueryParams());
            expect(result.current.queryParams.dateRange).toEqual(["2020", ""]);
        });
    });

    describe("updatePath", () => {
        it("pushes the updated param to the router", () => {
            const { result } = renderHook(() => useQueryParams());
            act(() => result.current.updatePath("sort", "alpha"));
            expect(mockPush).toHaveBeenCalledWith(
                expect.stringContaining("sort=alpha"),
                { scroll: false }
            );
        });
    });

    describe("updatePathMultiple", () => {
        it("merges multiple params into the URL", () => {
            (useSearchParams as jest.Mock).mockReturnValue(
                makeSearchParams({ query: "cancer" })
            );
            const { result } = renderHook(() => useQueryParams());
            act(() =>
                result.current.updatePathMultiple({ sort: "alpha", page: "2" })
            );
            const pushed = mockPush.mock.calls[0][0] as string;
            expect(pushed).toContain("sort=alpha");
            expect(pushed).toContain("page=2");
            expect(pushed).toContain("query=cancer");
        });
    });

    describe("removeArrayQueryAndPush", () => {
        it("removes only the matching key-value pair", () => {
            (useSearchParams as jest.Mock).mockReturnValue(
                makeSearchParams({ publisherName: "NHS", query: "cancer" })
            );
            const { result } = renderHook(() => useQueryParams());
            act(() =>
                result.current.removeArrayQueryAndPush("publisherName", "NHS")
            );
            const pushed = mockPush.mock.calls[0][0] as string;
            expect(pushed).not.toContain("publisherName");
            expect(pushed).toContain("query=cancer");
        });
    });

    describe("onQuerySubmit", () => {
        it("updates queryParams state and pushes to the URL", () => {
            const { result } = renderHook(() => useQueryParams());
            act(() => result.current.onQuerySubmit({ query: "diabetes" }));
            expect(result.current.queryParams.query).toBe("diabetes");
            expect(result.current.queryParams.page).toBe("1");
            expect(mockPush).toHaveBeenCalledWith(
                expect.stringContaining("query=diabetes"),
                expect.anything()
            );
        });
    });

    describe("onSortChange", () => {
        it("updates sort in queryParams and pushes to the URL", () => {
            const { result } = renderHook(() => useQueryParams());
            act(() => result.current.onSortChange("alpha"));
            expect(result.current.queryParams.sort).toBe("alpha");
            expect(mockPush).toHaveBeenCalled();
        });

        it("is a no-op when the value is unchanged", () => {
            (useSearchParams as jest.Mock).mockReturnValue(
                makeSearchParams({ sort: "alpha" })
            );
            const { result } = renderHook(() => useQueryParams());
            act(() => result.current.onSortChange("alpha"));
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    describe("resetQueryParamState", () => {
        it("clears all filters and resets to the selected type", () => {
            (useSearchParams as jest.Mock).mockReturnValue(
                makeSearchParams({
                    query: "cancer",
                    publisherName: "NHS",
                    page: "3",
                })
            );
            const { result } = renderHook(() => useQueryParams());
            act(() =>
                result.current.resetQueryParamState(SearchCategory.TOOLS)
            );
            const { queryParams } = result.current;
            expect(queryParams.type).toBe(SearchCategory.TOOLS);
            expect(queryParams.page).toBe("1");
            expect(queryParams.publisherName).toBeUndefined();
            expect(queryParams.dataSource).toBe(HDRUK_SOURCE_VALUE);
        });

        it("preserves the current query when resetting", () => {
            (useSearchParams as jest.Mock).mockReturnValue(
                makeSearchParams({ query: "cancer" })
            );
            const { result } = renderHook(() => useQueryParams());
            act(() =>
                result.current.resetQueryParamState(SearchCategory.DATA_USE)
            );
            expect(result.current.queryParams.query).toBe("cancer");
        });
    });
});
