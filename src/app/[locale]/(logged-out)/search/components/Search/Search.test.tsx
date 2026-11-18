import { rest } from "msw";
import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { SearchCategory } from "@/interfaces/Search";
import { Schema } from "@/interfaces/V4Schema";
import apis from "@/config/apis";
import messages from "@/config/messages/en.json";
import { fireEvent, render, screen, waitFor, within } from "@/utils/testUtils";
import {
    generatePartnerPortalsResult,
    generateSearchV2Response,
} from "@/mocks/data/search";
import {
    getSearchV2AggregationResults,
    postSearchV2Aggregation,
    SearchBody,
} from "@/mocks/handlers/search";
import { server } from "@/mocks/server";
import Search from "./Search";

jest.mock("@/providers/FeatureProvider", () => ({
    useFeatures: () => ({}),
}));

jest.mock("@/hooks/useCohortStatus", () => ({
    useCohortStatus: () => ({ requestStatus: null, hasAccess: false }),
}));

const t = messages.pages.search;

let requests: SearchBody[];

const lastBody = () => requests[requests.length - 1];

const renderSearch = (url: string) => {
    mockRouter.setCurrentUrl(url);

    return render(
        <MemoryRouterProvider>
            <Search filters={[]} schema={{ $defs: {} } as unknown as Schema} />
        </MemoryRouterProvider>
    );
};

describe("Search", () => {
    beforeEach(() => {
        requests = [];
        server.use(
            postSearchV2Aggregation(
                body => generateSearchV2Response(body.type as SearchCategory),
                requests
            )
        );
        window.scrollTo = jest.fn();
        jest.spyOn(window.history, "pushState").mockImplementation(
            (_data, _unused, url) => {
                if (url) {
                    mockRouter.push(`${url}`);
                }
            }
        );
    });

    it("requests the search described by the url", async () => {
        renderSearch(
            "/search?query=asthma&sort=name:asc&page=3&publisherName=Publisher A|Publisher B"
        );

        await waitFor(() => expect(requests).toHaveLength(1));
        expect(requests[0]).toMatchObject({
            type: "datasets",
            query: "asthma",
            sort: "name:asc",
            per_page: "25",
            page: "3",
            dataSource: "HDRUK",
            view_type: "mini",
            filters: {
                dataset: { publisherName: ["Publisher A", "Publisher B"] },
            },
        });
    });

    it("does not search europe pmc without a query", async () => {
        const v1Requests: string[] = [];
        server.use(
            rest.post(`${apis.searchV1Url}/*`, (req, res, ctx) => {
                v1Requests.push(req.url.href);
                return res(ctx.json({}));
            })
        );

        renderSearch("/search?type=publications&source=FED");

        await new Promise(resolve => setTimeout(resolve, 50));
        expect(v1Requests).toHaveLength(0);
        expect(requests).toHaveLength(0);
    });

    it("submits a query and resets the page", async () => {
        renderSearch("/search?page=3");
        await waitFor(() => expect(requests).toHaveLength(1));

        fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
            target: { value: "cancer" },
        });
        fireEvent.submit(screen.getByRole("search"));

        await waitFor(() =>
            expect(lastBody()).toMatchObject({ query: "cancer", page: "1" })
        );
        expect(mockRouter.query).toEqual({ query: "cancer" });
    });

    it("removes a filter chip and resets the page", async () => {
        renderSearch("/search?publisherName=Publisher A|Publisher B&page=2");
        await waitFor(() => expect(requests).toHaveLength(1));

        const chip = screen
            .getAllByText("Publisher A")
            .map(element => element.closest(".MuiChip-root"))
            .find(Boolean) as HTMLElement;
        fireEvent.click(within(chip).getByTestId("CloseIcon"));

        await waitFor(() =>
            expect(mockRouter.query).toEqual({ publisherName: "Publisher B" })
        );
        await waitFor(() => expect(lastBody().page).toBe("1"));
    });

    it("moves to the next page keeping the other params", async () => {
        server.use(
            postSearchV2Aggregation(
                () =>
                    generateSearchV2Response(
                        SearchCategory.DATASETS,
                        undefined,
                        60
                    ),
                requests
            )
        );
        renderSearch("/search?query=asthma");
        await screen.findByRole("table");

        fireEvent.click(
            screen.getByRole("button", { name: "Go to next page" })
        );

        await waitFor(() => expect(lastBody().page).toBe("2"));
        expect(mockRouter.query).toEqual({ query: "asthma", page: "2" });
    });

    it("keeps only the query when switching category", async () => {
        renderSearch("/search?query=asthma&publisherName=Publisher A&page=2");
        await screen.findByRole("table");

        fireEvent.click(screen.getByRole("tab", { name: t.tools }));

        await waitFor(() =>
            expect(lastBody()).toMatchObject({
                type: "tools",
                query: "asthma",
                page: "1",
            })
        );
        expect(lastBody()).not.toHaveProperty("filters");
    });

    it("shows the no results message when nothing matches", async () => {
        server.use(
            postSearchV2Aggregation(() =>
                generateSearchV2Response(SearchCategory.DATASETS, [])
            )
        );

        renderSearch("/search?query=nothing");

        expect(await screen.findByText(t.noResults)).toBeInTheDocument();
    });

    describe("partner portals", () => {
        const partners = generatePartnerPortalsResult();
        const [portal] = partners.portals;
        const [hit] = portal.hits;

        beforeEach(() => {
            server.use(
                postSearchV2Aggregation(
                    body => ({
                        ...generateSearchV2Response(
                            body.type as SearchCategory
                        ),
                        pending: ["partners"],
                        token: "srch_partner",
                    }),
                    requests
                ),
                getSearchV2AggregationResults({
                    pending: [],
                    results: { partners },
                })
            );
        });

        it("requests partner portals when they are selected", async () => {
            renderSearch("/search?query=asthma&dataSource=partners");

            await waitFor(() => expect(requests).toHaveLength(1));
            expect(requests[0]).toMatchObject({ dataSource: "partners" });
        });

        it("falls back to the gateway for an unknown data source", async () => {
            renderSearch("/search?query=asthma&dataSource=unknown");

            await waitFor(() => expect(requests).toHaveLength(1));
            expect(requests[0]).toMatchObject({ dataSource: "HDRUK" });
        });

        it("links each partner result to its partner portal", async () => {
            renderSearch("/search?query=asthma&dataSource=partners");

            const link = await screen.findByRole("link", { name: hit.title });
            expect(link).toHaveAttribute("href", hit.url);
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute(
                "rel",
                expect.stringContaining("noopener")
            );
            expect(
                screen.getByText(hit.organisation as string)
            ).toBeInTheDocument();
            expect(
                screen.getAllByRole("img", { name: portal.name })[0]
            ).toHaveAttribute("src", portal.logo);
        });

        it("links to the full results on each partner portal", async () => {
            renderSearch("/search?query=asthma&dataSource=partners");

            const viewAll = await screen.findByRole("link", {
                name: t.viewAllPartnerResults.replace("{name}", portal.name),
            });
            expect(viewAll).toHaveAttribute("href", portal.search_url);
        });

        it("shows the partner portal logos on the gateway results", async () => {
            renderSearch("/search?query=asthma");

            expect(
                await screen.findByRole("img", { name: portal.name })
            ).toHaveAttribute("src", portal.logo);
        });
    });
});
