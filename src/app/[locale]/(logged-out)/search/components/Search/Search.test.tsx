import { rest } from "msw";
import mockRouter from "next-router-mock";
import { unstable_serialize } from "swr";
import { SearchCategory } from "@/interfaces/Search";
import apis from "@/config/apis";
import messages from "@/config/messages/en.json";
import { act, fireEvent, screen, waitFor, within } from "@/utils/testUtils";
import {
    generateSearchV2Response,
    typesenseSearchFlags,
} from "@/mocks/data/search";
import {
    postSearchV2Aggregation,
    RecordedRequest,
} from "@/mocks/handlers/search";
import { server } from "@/mocks/server";
import { SKELETON_RESULT_COUNT } from "../../constants";
import { parseQueryParams } from "../../utils/queryParams";
import { getSearchMode, getV2SearchBody } from "../../utils/searchRequest";
import {
    gtmEvents,
    mockSearch,
    mockSearchV1,
    renderSearch,
    resetSearchTestState,
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

const searchKey = (query: string) => {
    const queryParams = parseQueryParams(new URLSearchParams(query));

    return unstable_serialize([
        apis.searchV2AggregationUrl,
        getV2SearchBody(
            queryParams,
            getSearchMode(queryParams, typesenseSearchFlags)
        ),
    ]);
};

describe("Search", () => {
    beforeEach(() => {
        resetSearchTestState();
    });

    describe("request shape", () => {
        it.each([
            SearchCategory.DATA_USE,
            SearchCategory.TOOLS,
            SearchCategory.PUBLICATIONS,
            SearchCategory.COLLECTIONS,
            SearchCategory.DATA_CUSTODIANS,
        ])("requests %s with the default params", async type => {
            const requests = mockSearch(type);

            renderSearch(`/search?type=${type}`);

            await waitFor(() => expect(requests).toHaveLength(1));
            expect(requests[0].body).toEqual({
                type,
                sort: "score:desc",
                per_page: "25",
                page: "1",
                dataSource: "HDRUK",
            });
        });

        it("requests datasets with the mini view", async () => {
            const requests = mockSearch(SearchCategory.DATASETS);

            renderSearch("/search?type=datasets");

            await waitFor(() => expect(requests).toHaveLength(1));
            expect(requests[0].body).toEqual({
                type: "datasets",
                sort: "score:desc",
                per_page: "25",
                page: "1",
                dataSource: "HDRUK",
                view_type: "mini",
            });
        });

        it("defaults to datasets when the url has no type", async () => {
            const requests = mockSearch(SearchCategory.DATASETS);

            renderSearch("/search");

            await waitFor(() => expect(requests).toHaveLength(1));
            expect(requests[0].body.type).toBe("datasets");
        });

        it("forwards query, sort and page from the url", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);

            renderSearch(
                "/search?type=tools&query=asthma&sort=name:asc&page=3"
            );

            await waitFor(() => expect(requests).toHaveLength(1));
            expect(requests[0].body).toMatchObject({
                query: "asthma",
                sort: "name:asc",
                page: "3",
            });
        });

        it("maps dataset filters from the url into the request body", async () => {
            const requests = mockSearch(SearchCategory.DATASETS);

            renderSearch(
                "/search?type=datasets&containsBioSamples=containsBioSamples&populationSize=10|100&publisherName=Publisher A|Publisher B"
            );

            await waitFor(() => expect(requests).toHaveLength(1));
            expect(requests[0].body.filters).toEqual({
                dataset: {
                    containsBioSamples: [true],
                    populationSize: {
                        from: "10",
                        to: "100",
                        includeUnreported: true,
                    },
                    publisherName: ["Publisher A", "Publisher B"],
                },
            });
        });

        it("maps filters for other categories without dataset transforms", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);

            renderSearch("/search?type=tools&typeCategory=Software|Model");

            await waitFor(() => expect(requests).toHaveLength(1));
            expect(requests[0].body.filters).toEqual({
                tool: { typeCategory: ["Software", "Model"] },
            });
        });
    });

    it.each([
        [SearchCategory.PUBLICATIONS, "paper", "datasetLinkTypes"],
        [SearchCategory.TOOLS, "tool", "license"],
        [SearchCategory.TOOLS, "tool", "category"],
    ])(
        "sends the %s %s filter %s from the url",
        async (type, filterType, filterName) => {
            const requests = mockSearch(type);

            renderSearch(`/search?type=${type}&${filterName}=A|B`);

            await waitFor(() => expect(requests).toHaveLength(1));
            expect(requests[0].body).toMatchObject({
                filters: { [filterType]: { [filterName]: ["A", "B"] } },
            });
        }
    );

    describe("europe pmc gating", () => {
        it("does not search europe pmc without a query", async () => {
            const requests = mockSearchV1(SearchCategory.PUBLICATIONS);

            renderSearch("/search?type=publications&source=FED");

            await settle();
            expect(requests).toHaveLength(0);
        });

        it("searches europe pmc on v1 when there is a query", async () => {
            const requests = mockSearchV1(SearchCategory.PUBLICATIONS);
            const aggregationRequests = mockSearch(SearchCategory.PUBLICATIONS);

            renderSearch("/search?type=publications&source=FED&query=asthma");

            await waitFor(() => expect(requests).toHaveLength(1));
            expect(requests[0].searchParams.source).toBe("FED");
            await settle();
            expect(aggregationRequests).toHaveLength(0);
        });

        it("searches europe pmc without a query when forced", async () => {
            const requests = mockSearchV1(SearchCategory.PUBLICATIONS);

            renderSearch("/search?type=publications&source=FED&force");

            await waitFor(() => expect(requests).toHaveLength(1));
        });
    });

    describe("results", () => {
        it("renders datasets as a table linking to each dataset", async () => {
            mockSearch(SearchCategory.DATASETS);

            renderSearch("/search?type=datasets");

            const table = await screen.findByRole("table");
            const links = within(table)
                .getAllByRole("link")
                .map(link => link.getAttribute("href"));
            expect(links).toEqual(
                expect.arrayContaining(["/dataset/1", "/dataset/2"])
            );
        });

        it.each([
            [SearchCategory.TOOLS, "Tool 1"],
            [SearchCategory.COLLECTIONS, "Collection 1"],
            [SearchCategory.DATA_CUSTODIANS, "Data custodian 1"],
            [SearchCategory.PUBLICATIONS, "Publication 1"],
            [SearchCategory.DATA_USE, "Data use 1"],
        ])("renders %s results as a list", async (type, firstResult) => {
            mockSearch(type);

            renderSearch(`/search?type=${type}`);

            expect(await screen.findByText(firstResult)).toBeInTheDocument();
            expect(screen.queryByRole("table")).not.toBeInTheDocument();
        });

        it("shows the no results message when nothing matches", async () => {
            mockSearch(
                SearchCategory.TOOLS,
                generateSearchV2Response(SearchCategory.TOOLS, {}, { hits: [] })
            );

            renderSearch("/search?type=tools");

            expect(await screen.findByText(t.noResults)).toBeInTheDocument();
        });

        it("hides the no results message for publications without a query", async () => {
            const requests = mockSearch(
                SearchCategory.PUBLICATIONS,
                generateSearchV2Response(
                    SearchCategory.PUBLICATIONS,
                    {},
                    { hits: [] }
                )
            );

            renderSearch("/search?type=publications");

            await waitFor(() => expect(requests).toHaveLength(1));
            await settle();
            expect(screen.queryByText(t.noResults)).not.toBeInTheDocument();
        });

        it("warns about the result limit when there are more than 100 results", async () => {
            mockSearch(
                SearchCategory.TOOLS,
                generateSearchV2Response(
                    SearchCategory.TOOLS,
                    {},
                    { total: 150 }
                )
            );

            renderSearch("/search?type=tools");

            await waitFor(() =>
                expect(screen.getByText(t.resultLimit)).toBeVisible()
            );
        });

        it("shows the total when it is within the limit", async () => {
            mockSearch(
                SearchCategory.TOOLS,
                generateSearchV2Response(
                    SearchCategory.TOOLS,
                    {},
                    { total: 42 }
                )
            );

            renderSearch("/search?type=tools");

            await screen.findByText("Tool 1");
            expect(document.getElementById("result-summary")).toHaveTextContent(
                "42"
            );
            expect(screen.getByText(t.resultLimit)).not.toBeVisible();
        });

        it("requests data custodian networks alongside collections", async () => {
            const networkRequests: RecordedRequest[] = [];
            server.use(
                postSearchV2Aggregation(
                    generateSearchV2Response(
                        SearchCategory.COLLECTIONS,
                        {},
                        { hits: [] }
                    ),
                    networkRequests,
                    "data_custodian_networks"
                )
            );
            mockSearch(SearchCategory.COLLECTIONS);

            renderSearch("/search?type=collections&query=cancer");

            await waitFor(() => expect(networkRequests).toHaveLength(1));
            expect(networkRequests[0].body).toMatchObject({ query: "cancer" });
        });
    });

    describe("server results", () => {
        const initialResultsFor = (query: string) => ({
            key: searchKey(query),
            data: generateSearchV2Response(SearchCategory.TOOLS),
        });

        it("shows the search bar, categories and a loader without searching while pending", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);

            renderSearch("/search?type=tools&query=asthma", undefined, {
                isPending: true,
            });

            expect(screen.getByRole("textbox", { name: "Search" })).toHaveValue(
                "asthma"
            );
            expect(
                screen.getByRole("tab", { name: t.tools })
            ).toBeInTheDocument();
            expect(screen.getByText(t.loadingAriaLabel)).toBeInTheDocument();
            expect(
                screen.queryByRole("navigation", { name: "pagination" })
            ).not.toBeInTheDocument();
            await settle();
            expect(requests).toHaveLength(0);
            expect(gtmEvents("search_performed")).toHaveLength(0);
        });

        it("renders the server results without requesting them", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);

            renderSearch("/search?type=tools&query=asthma", undefined, {
                initialResults: initialResultsFor("type=tools&query=asthma"),
            });

            expect(screen.getByText("Tool 1")).toBeInTheDocument();
            await settle();
            expect(requests).toHaveLength(0);
        });

        it("requests results when the server results are for another search", async () => {
            const requests = mockSearch(SearchCategory.TOOLS);

            renderSearch("/search?type=tools&query=asthma", undefined, {
                initialResults: initialResultsFor("type=tools&query=cancer"),
            });

            await waitFor(() => expect(requests).toHaveLength(1));
        });

        it("shows the server results again after going back to them", async () => {
            mockSearch(
                SearchCategory.TOOLS,
                generateSearchV2Response(
                    SearchCategory.TOOLS,
                    {},
                    { total: 60 }
                )
            );
            renderSearch("/search?type=tools&query=asthma", undefined, {
                initialResults: initialResultsFor("type=tools&query=asthma"),
            });
            const summary = () => document.getElementById("result-summary");
            expect(summary()).toHaveTextContent("1-2");

            await act(async () => {
                await mockRouter.push("/search?type=tools&query=asthma&page=2");
            });
            await waitFor(() => expect(summary()).toHaveTextContent("26-50"));

            await act(async () => {
                await mockRouter.push("/search?type=tools&query=asthma");
            });
            await waitFor(() => expect(summary()).toHaveTextContent("1-2"));
        });

        it("keeps the server key stable through serialisation", () => {
            const queryParams = parseQueryParams(
                new URLSearchParams("type=datasets&populationSize=10")
            );
            const body = getV2SearchBody(
                queryParams,
                getSearchMode(queryParams, typesenseSearchFlags)
            );

            expect(
                unstable_serialize([
                    apis.searchV2AggregationUrl,
                    JSON.parse(JSON.stringify(body)),
                ])
            ).toBe(searchKey("type=datasets&populationSize=10"));
        });
    });

    describe("loading states", () => {
        const skeleton = () => screen.getByTestId("search-results-skeleton");

        it("shows a table skeleton for datasets in table view", () => {
            renderSearch("/search?type=datasets", undefined, {
                isPending: true,
            });

            const table = within(skeleton()).getByRole("table", {
                hidden: true,
            });
            expect(
                within(table).getAllByRole("row", { hidden: true })
            ).toHaveLength(SKELETON_RESULT_COUNT + 1);
            expect(
                within(table).queryAllByRole("link", { hidden: true })
            ).toHaveLength(0);
        });

        it("shows list skeletons for list views", () => {
            renderSearch("/search?type=tools", undefined, { isPending: true });

            expect(
                within(skeleton()).getAllByRole("listitem", { hidden: true })
            ).toHaveLength(SKELETON_RESULT_COUNT);
        });

        it("shows tile skeletons for tiled categories", () => {
            renderSearch("/search?type=collections", undefined, {
                isPending: true,
            });

            expect(
                skeleton().querySelectorAll(".MuiSkeleton-root")
            ).toHaveLength(SKELETON_RESULT_COUNT);
            expect(skeleton().querySelector("li")).toBeNull();
        });

        it("keeps the previous results visible and dimmed while the next page loads", async () => {
            server.use(
                rest.post(
                    apis.searchV2AggregationUrl,
                    async (req, res, ctx) => {
                        const { page } = await req.json();
                        return page === "2"
                            ? res(
                                  ctx.delay(300),
                                  ctx.json({
                                      data: generateSearchV2Response(
                                          SearchCategory.TOOLS,
                                          {},
                                          {
                                              hits: [
                                                  {
                                                      _id: "26",
                                                      name: "Tool 26",
                                                  },
                                              ] as never,
                                              total: 60,
                                          }
                                      ),
                                  })
                              )
                            : res(
                                  ctx.json({
                                      data: generateSearchV2Response(
                                          SearchCategory.TOOLS,
                                          {},
                                          { total: 60 }
                                      ),
                                  })
                              );
                    }
                )
            );
            renderSearch("/search?type=tools");
            await screen.findByText("Tool 1");

            fireEvent.click(
                screen.getByRole("button", { name: "Go to next page" })
            );

            await waitFor(() =>
                expect(screen.getByText(t.loadingAriaLabel)).toBeInTheDocument()
            );
            expect(screen.getByText("Tool 1")).toBeInTheDocument();
            expect(
                screen.getByRole("region", { name: "results list" })
            ).toHaveStyle({ opacity: "0.38" });
            expect(
                screen.getByRole("button", { name: "Go to previous page" })
            ).toBeDisabled();
            expect(
                within(document.getElementById("result-summary")!).getByText(
                    /Showing/
                )
            ).not.toBeVisible();
            expect(screen.getByRole("combobox")).toHaveAttribute(
                "aria-disabled",
                "true"
            );

            expect(await screen.findByText("Tool 26")).toBeInTheDocument();
            expect(
                screen.queryByText(t.loadingAriaLabel)
            ).not.toBeInTheDocument();
        });
    });
});
