import Cookies from "js-cookie";
import mockRouter from "next-router-mock";
import { SearchCategory, ViewType } from "@/interfaces/Search";
import config from "@/config/config";
import messages from "@/config/messages/en.json";
import { act, fireEvent, screen, waitFor, within } from "@/utils/testUtils";
import { generateSearchV2Response } from "@/mocks/data/search";
import { RecordedRequest } from "@/mocks/handlers/search";
import {
    gtmEvents,
    mockSearch,
    renderSearch,
    resetSearchTestState,
    setScreenWidth,
    urlParams,
} from "./testUtils";

jest.mock("@/providers/FeatureProvider", () => ({
    useFeatures: jest.fn(),
}));

jest.mock("@/hooks/useCohortStatus", () => ({
    useCohortStatus: () => ({ requestStatus: null, hasAccess: false }),
}));

jest.mock("@/utils/download", () => ({
    downloadFile: jest.fn(),
}));

const t = messages.pages.search;

const settle = () => new Promise(resolve => setTimeout(resolve, 50));

const lastRequest = (requests: RecordedRequest[]) =>
    requests[requests.length - 1];

const searchInput = () => screen.getByRole("textbox", { name: "Search" });

const submitQuery = (query: string) => {
    fireEvent.change(searchInput(), { target: { value: query } });
    fireEvent.submit(screen.getByRole("search"));
};

const removeChip = (label: string) => {
    const chip = screen
        .getAllByText(label)
        .map(element => element.closest(".MuiChip-root"))
        .find(Boolean) as HTMLElement;
    fireEvent.click(within(chip).getByTestId("CloseIcon"));
};

describe("Search navigation", () => {
    beforeEach(() => {
        resetSearchTestState();
    });

    describe("query", () => {
        it("shows the query from the url in the search input", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);

            renderSearch("/search?type=tools&query=asthma");

            await waitFor(() => expect(requests).toHaveLength(1));
            expect(searchInput()).toHaveValue("asthma");
            expect(searchInput()).toHaveAttribute("id", "query");
        });

        it("submits the query, resets the page and requests it", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);
            renderSearch("/search?type=tools&page=3");
            await waitFor(() => expect(requests).toHaveLength(1));

            submitQuery("asthma");

            await waitFor(() =>
                expect(lastRequest(requests).body).toMatchObject({
                    query: "asthma",
                    page: "1",
                })
            );
            expect(urlParams()).toEqual({ type: "tools", query: "asthma" });
        });

        it("clears the query and resets the page", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);
            renderSearch("/search?type=tools&query=asthma&page=3");
            await waitFor(() => expect(requests).toHaveLength(1));

            fireEvent.click(screen.getByRole("button", { name: "clear text" }));

            await waitFor(() => expect(requests).toHaveLength(2));
            expect(lastRequest(requests).body).not.toHaveProperty("query");
            expect(lastRequest(requests).body.page).toBe("1");
            expect(urlParams()).toEqual({ type: "tools" });
        });
    });

    describe("filters", () => {
        it("applies a filter from the panel and resets the page", async () => {
            const requests = mockSearch(SearchCategory.DATASETS);
            renderSearch("/search?type=datasets&page=2");
            await waitFor(() => expect(requests).toHaveLength(1));

            fireEvent.click(
                screen.getByRole("checkbox", {
                    name: t.components.FilterPanel.filters.dataset
                        .containsBioSamples,
                })
            );

            await waitFor(() =>
                expect(lastRequest(requests).body).toMatchObject({
                    filters: { dataset: { containsBioSamples: [true] } },
                })
            );
            expect(urlParams()).toEqual({
                type: "datasets",
                containsBioSamples: "containsBioSamples",
            });
        });

        it("resets the page when a chip is removed", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);
            renderSearch(
                "/search?type=tools&typeCategory=Software|Model&page=2"
            );
            await waitFor(() => expect(requests).toHaveLength(1));

            removeChip("Software");

            await waitFor(() =>
                expect(urlParams()).toEqual({
                    type: "tools",
                    typeCategory: "Model",
                })
            );
            await waitFor(() =>
                expect(lastRequest(requests).body.page).toBe("1")
            );
        });

        it("removes one of several dataset titles from the url", async () => {
            const requests = mockSearch(SearchCategory.DATA_USE);
            renderSearch("/search?type=dur&datasetTitles=Title A|Title B");
            await waitFor(() => expect(requests).toHaveLength(1));

            removeChip("Title A");

            await waitFor(() =>
                expect(urlParams().datasetTitles).toBe("Title B")
            );
            await waitFor(() =>
                expect(lastRequest(requests).body).toMatchObject({
                    filters: {
                        dataUseRegister: { datasetTitles: ["Title B"] },
                    },
                })
            );
        });

        it("clears all filters and the page but keeps the search", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);
            renderSearch(
                "/search?type=tools&query=asthma&sort=name:asc&typeCategory=Software&page=2"
            );
            await waitFor(() => expect(requests).toHaveLength(1));

            fireEvent.click(
                screen.getByRole("button", {
                    name: t.components.FilterPanel.filters.clearAll,
                })
            );

            await waitFor(() =>
                expect(urlParams()).toEqual({
                    type: "tools",
                    query: "asthma",
                    sort: "name:asc",
                })
            );
            await waitFor(() =>
                expect(lastRequest(requests).body).not.toHaveProperty("filters")
            );
            expect(lastRequest(requests).body).toMatchObject({
                query: "asthma",
                sort: "name:asc",
                page: "1",
            });
        });

        it("clears data subtypes when a data type chip is removed", async () => {
            const requests = mockSearch(SearchCategory.DATASETS);
            renderSearch(
                "/search?type=datasets&dataType=Health|Social&dataSubType=Sub"
            );
            await waitFor(() => expect(requests).toHaveLength(1));

            removeChip("Health");

            await waitFor(() =>
                expect(urlParams()).toEqual({
                    type: "datasets",
                    dataType: "Social",
                })
            );
            await waitFor(() =>
                expect(lastRequest(requests).body.filters).toMatchObject({
                    dataset: { dataType: ["Social"] },
                })
            );
            expect(
                (lastRequest(requests).body.filters as Record<string, object>)
                    .dataset
            ).not.toHaveProperty("dataSubType");
        });

        it("blanks the removed slot of a date range", async () => {
            const requests = mockSearch(SearchCategory.DATASETS);
            renderSearch("/search?type=datasets&dateRange=2010|2020");
            await waitFor(() => expect(requests).toHaveLength(1));

            removeChip("2010");

            await waitFor(() => expect(urlParams().dateRange).toBe("|2020"));
        });
    });

    describe("sort", () => {
        it("updates the sort in the url and the request", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);
            renderSearch("/search?type=tools");
            await waitFor(() => expect(requests).toHaveLength(1));

            fireEvent.mouseDown(screen.getByRole("combobox"));
            fireEvent.click(
                await screen.findByRole("option", {
                    name: "Sort alphabetically by name (A-Z)",
                })
            );

            await waitFor(() =>
                expect(lastRequest(requests).body.sort).toBe("name:asc")
            );
            expect(urlParams().sort).toBe("name:asc");
        });

        it("resets the page when the sort changes", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);
            renderSearch("/search?type=tools&page=2");
            await waitFor(() => expect(requests).toHaveLength(1));

            fireEvent.mouseDown(screen.getByRole("combobox"));
            fireEvent.click(
                await screen.findByRole("option", {
                    name: "Sort alphabetically by name (A-Z)",
                })
            );

            await waitFor(() =>
                expect(urlParams()).toEqual({ type: "tools", sort: "name:asc" })
            );
        });

        it("does not add a history entry on load", async () => {
            const push = jest.spyOn(mockRouter, "push");
            const requests = mockSearch(SearchCategory.TOOLS);

            renderSearch("/search?type=tools&page=3&sort=name:asc");
            await waitFor(() => expect(requests).toHaveLength(1));
            await settle();

            expect(push).not.toHaveBeenCalled();
            expect(window.history.pushState).not.toHaveBeenCalled();
            push.mockRestore();
        });
    });

    describe("pagination", () => {
        it("moves to the next page keeping the other params", async () => {
            const requests = mockSearch(
                SearchCategory.TOOLS,
                generateSearchV2Response(
                    SearchCategory.TOOLS,
                    {},
                    { total: 60 }
                )
            );
            renderSearch("/search?type=tools&query=asthma");
            await screen.findByText("Tool 1");

            fireEvent.click(
                screen.getByRole("button", { name: "Go to next page" })
            );

            await waitFor(() =>
                expect(lastRequest(requests).body.page).toBe("2")
            );
            expect(lastRequest(requests).body.query).toBe("asthma");
            expect(urlParams()).toMatchObject({
                type: "tools",
                query: "asthma",
                page: "2",
            });
        });
    });

    describe("results view", () => {
        it("switches datasets to the list view", async () => {
            mockSearch(SearchCategory.DATASETS);
            renderSearch("/search?type=datasets&page=2");
            await screen.findByRole("table");

            fireEvent.click(
                screen.getByRole("button", {
                    name: t.components.Search.toggleLabelList,
                })
            );

            await waitFor(() =>
                expect(screen.queryByRole("table")).not.toBeInTheDocument()
            );
            expect(urlParams()).toMatchObject({ view: "list", page: "2" });
            expect(Cookies.get(config.VIEW_TYPE)).toBe(ViewType.LIST);
        });

        it("restores the list view from the cookie", async () => {
            Cookies.set(config.VIEW_TYPE, ViewType.LIST);
            mockSearch(SearchCategory.DATASETS);

            renderSearch("/search?type=datasets");

            expect(
                await screen.findByRole("button", {
                    name: t.components.Search.toggleLabelTable,
                })
            ).toBeInTheDocument();
            expect(screen.queryByRole("table")).not.toBeInTheDocument();
        });

        it("uses the view from the url", async () => {
            mockSearch(SearchCategory.DATASETS);

            renderSearch("/search?type=datasets&view=list");

            expect(
                await screen.findByRole("button", {
                    name: t.components.Search.toggleLabelTable,
                })
            ).toBeInTheDocument();
            expect(screen.queryByRole("table")).not.toBeInTheDocument();
        });

        it("has no view toggle outside datasets", async () => {
            mockSearch(SearchCategory.TOOLS);

            renderSearch("/search?type=tools");

            await screen.findByText("Tool 1");
            expect(
                screen.queryByRole("button", {
                    name: t.components.Search.toggleLabelList,
                })
            ).not.toBeInTheDocument();
        });
    });

    describe("analytics", () => {
        it("fires search_performed on load with the term and filters", async () => {
            mockSearch(SearchCategory.TOOLS);

            renderSearch(
                "/search?type=tools&query=asthma&typeCategory=Software"
            );

            await waitFor(() =>
                expect(gtmEvents("search_performed")).toHaveLength(1)
            );
            expect(gtmEvents("search_performed")[0]).toMatchObject({
                search_term: "asthma",
                filter_list: { typeCategory: ["Software"] },
            });
        });

        it("fires search_performed again for a new query but not for a view toggle", async () => {
            mockSearch(SearchCategory.DATASETS);
            renderSearch("/search?type=datasets");
            await screen.findByRole("table");
            expect(gtmEvents("search_performed")).toHaveLength(1);

            fireEvent.click(
                screen.getByRole("button", {
                    name: t.components.Search.toggleLabelList,
                })
            );
            await settle();
            expect(gtmEvents("search_performed")).toHaveLength(1);

            submitQuery("asthma");
            await waitFor(() =>
                expect(gtmEvents("search_performed")).toHaveLength(2)
            );
        });
    });

    describe("save search availability", () => {
        it.each([
            ["/search?type=datasets", true],
            ["/search?type=datasets&view=list", true],
            ["/search?type=datasets&query=asthma", false],
            ["/search?type=datasets&page=2", false],
        ])("for %s the save button disabled is %s", async (url, disabled) => {
            mockSearch(SearchCategory.DATASETS);

            renderSearch(url);

            const save = await screen.findByRole("button", {
                name: t.saveSearch,
            });
            await waitFor(() =>
                expect((save as HTMLButtonElement).disabled).toBe(disabled)
            );
        });
    });

    describe("category", () => {
        it("keeps the query when switching category with the desktop tabs", async () => {
            mockSearch(SearchCategory.DATASETS);
            const toolRequests = mockSearch(SearchCategory.TOOLS);
            renderSearch(
                "/search?type=datasets&query=asthma&containsBioSamples=containsBioSamples&page=2"
            );
            await screen.findByRole("table");

            const toolsTab = screen.getByRole("tab", { name: t.tools });
            expect(toolsTab).toHaveAttribute(
                "href",
                "/search?type=tools&query=asthma"
            );

            fireEvent.click(toolsTab);

            await waitFor(() => expect(toolRequests).toHaveLength(1));
            expect(toolRequests[0].body).toEqual({
                type: "tools",
                query: "asthma",
                sort: "score:desc",
                per_page: "25",
                page: "1",
                dataSource: "HDRUK",
            });
            expect(urlParams()).toEqual({ type: "tools", query: "asthma" });
        });

        it("keeps only the query when switching category on mobile", async () => {
            setScreenWidth(400);
            mockSearch(SearchCategory.DATASETS);
            const toolRequests = mockSearch(SearchCategory.TOOLS);
            renderSearch(
                "/search?type=datasets&query=asthma&containsBioSamples=containsBioSamples&page=2"
            );

            fireEvent.click(
                await screen.findByRole("button", {
                    name: "Open to show search type options",
                })
            );
            fireEvent.click(screen.getByRole("menuitem", { name: t.tools }));

            await waitFor(() => expect(toolRequests).toHaveLength(1));
            expect(toolRequests[0].body).toEqual({
                type: "tools",
                query: "asthma",
                sort: "score:desc",
                per_page: "25",
                page: "1",
                dataSource: "HDRUK",
            });
            expect(urlParams()).toEqual({ type: "tools", query: "asthma" });
        });
    });

    describe("history", () => {
        it("follows a url change within the same category", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);
            renderSearch("/search?type=tools&query=asthma&sort=name:asc");
            await waitFor(() => expect(requests).toHaveLength(1));

            await act(async () => {
                await mockRouter.push(
                    "/search?type=tools&query=cancer&sort=name:desc&page=2"
                );
            });

            await waitFor(() => expect(requests).toHaveLength(2));
            expect(lastRequest(requests).body).toMatchObject({
                query: "cancer",
                sort: "name:desc",
                page: "2",
            });
            await waitFor(() => expect(searchInput()).toHaveValue("cancer"));
            expect(screen.getByRole("combobox")).toHaveTextContent(
                "Sort alphabetically by name (Z-A)"
            );
        });
    });
});
