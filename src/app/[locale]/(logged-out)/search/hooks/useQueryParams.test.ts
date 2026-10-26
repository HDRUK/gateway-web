import { act } from "@testing-library/react";
import { usePathname, useSearchParams } from "next/navigation";
import { SearchCategory } from "@/interfaces/Search";
import { renderHook } from "@/utils/testUtils";
import { useQueryParams } from "./useQueryParams";

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
}));

const setUrl = (params: Record<string, string> = {}) =>
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(params));

const pushState = jest.spyOn(window.history, "pushState");

const pushedUrls = () => pushState.mock.calls.map(([, , url]) => `${url}`);

beforeEach(() => {
    pushState.mockReset();
    pushState.mockImplementation(() => {});
    (usePathname as jest.Mock).mockReturnValue("/en/search");
    setUrl();
});

describe("useQueryParams", () => {
    it("parses the search state from the url", () => {
        setUrl({ type: SearchCategory.TOOLS, query: "cancer", page: "3" });

        const { result } = renderHook(() => useQueryParams());

        expect(result.current.queryParams).toMatchObject({
            type: SearchCategory.TOOLS,
            query: "cancer",
            page: "3",
            per_page: "25",
        });
    });

    it("keeps the same search state when only the view changes", () => {
        setUrl({ type: SearchCategory.DATASETS, query: "cancer" });
        const { result, rerender } = renderHook(() => useQueryParams());
        const before = result.current.queryParams;

        setUrl({
            type: SearchCategory.DATASETS,
            query: "cancer",
            view: "list",
        });
        rerender();

        expect(result.current.queryParams).toBe(before);
    });

    describe("setSearchParams", () => {
        it("pushes joined values and resets the page", () => {
            setUrl({ type: SearchCategory.DATASETS, page: "4" });
            const { result } = renderHook(() => useQueryParams());

            act(() =>
                result.current.setSearchParams({
                    publisherName: ["NHS", "UKHSA"],
                })
            );

            expect(pushedUrls()).toEqual([
                "/en/search?type=datasets&publisherName=NHS%7CUKHSA",
            ]);
        });

        it("keeps the page when asked to", () => {
            setUrl({ type: SearchCategory.DATASETS, page: "4" });
            const { result } = renderHook(() => useQueryParams());

            act(() =>
                result.current.setSearchParams(
                    { view: "list" },
                    { resetPage: false }
                )
            );

            expect(pushedUrls()).toEqual([
                "/en/search?type=datasets&page=4&view=list",
            ]);
        });

        it("removes empty values", () => {
            setUrl({
                type: SearchCategory.DATASETS,
                query: "cancer",
                dateRange: "2010|2020",
            });
            const { result } = renderHook(() => useQueryParams());

            act(() =>
                result.current.setSearchParams({
                    query: "",
                    dateRange: ["", ""],
                })
            );

            expect(pushedUrls()).toEqual(["/en/search?type=datasets"]);
        });

        it("does nothing when the url would not change", () => {
            setUrl({ type: SearchCategory.DATASETS, query: "cancer" });
            const { result } = renderHook(() => useQueryParams());

            act(() => result.current.setSearchParams({ query: "cancer" }));

            expect(pushState).not.toHaveBeenCalled();
        });

        it("keeps earlier changes made before the url updates", () => {
            const { result } = renderHook(() => useQueryParams());

            act(() => {
                result.current.setSearchParams({ publisherName: ["NHS"] });
                result.current.setSearchParams({ sector: ["Academia"] });
            });

            expect(pushedUrls()[1]).toBe(
                "/en/search?publisherName=NHS&sector=Academia"
            );
        });

        it("builds from the url again once it moves on", () => {
            const { result, rerender } = renderHook(() => useQueryParams());
            act(() =>
                result.current.setSearchParams({ publisherName: ["NHS"] })
            );

            setUrl({ query: "cancer" });
            rerender();
            act(() => result.current.setSearchParams({ sector: ["Academia"] }));

            expect(pushedUrls()[1]).toBe(
                "/en/search?query=cancer&sector=Academia"
            );
        });
    });

    it("submits the query", () => {
        setUrl({ type: SearchCategory.TOOLS, page: "2" });
        const { result } = renderHook(() => useQueryParams());

        act(() => result.current.onQuerySubmit({ query: "diabetes" }));

        expect(pushedUrls()).toEqual(["/en/search?type=tools&query=diabetes"]);
    });

    describe("onSortChange", () => {
        it("pushes a new sort", () => {
            const { result } = renderHook(() => useQueryParams());

            act(() => result.current.onSortChange("title:asc"));

            expect(pushedUrls()).toEqual(["/en/search?sort=title%3Aasc"]);
        });

        it("ignores the current sort", () => {
            const { result } = renderHook(() => useQueryParams());

            act(() => result.current.onSortChange("score:desc"));

            expect(pushState).not.toHaveBeenCalled();
        });
    });
});
