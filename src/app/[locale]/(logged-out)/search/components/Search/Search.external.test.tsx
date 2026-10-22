import { unstable_serialize } from "swr";
import {
    SearchAggregationProviderResult,
    SearchCategory,
} from "@/interfaces/Search";
import apis from "@/config/apis";
import messages from "@/config/messages/en.json";
import { fireEvent, screen, waitFor } from "@/utils/testUtils";
import {
    generateArdcResults,
    generateSearchV2Response,
    typesenseSearchFlags,
} from "@/mocks/data/search";
import {
    getSearchV2AggregationResults,
    postSearchV2Aggregation,
    RecordedRequest,
} from "@/mocks/handlers/search";
import { server } from "@/mocks/server";
import { parseQueryParams } from "../../utils/queryParams";
import { getSearchMode, getV2SearchBody } from "../../utils/searchRequest";
import { renderSearch, resetSearchTestState, urlParams } from "./testUtils";

jest.mock("@/providers/FeatureProvider", () => ({
    useFeatures: jest.fn(),
}));

jest.mock("@/hooks/useCohortStatus", () => ({
    useCohortStatus: () => ({ requestStatus: null, hasAccess: false }),
}));

const POLL_TIMEOUT = 5000;

const t = messages.pages.search;
const tBanner = t.components.PartnerResourcesBanner;

const ardcResult: SearchAggregationProviderResult = {
    provider_logo: "https://example.com/ardc.png",
    about: null,
    hits: generateArdcResults(2),
    total: 7,
    aggregations: [],
    ids: [],
};

const mockExternalSearch = () => {
    const aggregationRequests: RecordedRequest[] = [];
    const pollRequests: string[] = [];
    server.use(
        postSearchV2Aggregation(
            ({ body }) =>
                generateSearchV2Response(SearchCategory.DATASETS, {
                    query: `${body.query ?? ""}`,
                    token: "token-1",
                    pending: ["ARDC"],
                    ...(body.dataSource === "ARDC"
                        ? { results: { ARDC: ardcResult } }
                        : {}),
                }),
            aggregationRequests
        ),
        getSearchV2AggregationResults(
            "token-1",
            { pending: [], results: { ARDC: ardcResult } },
            pollRequests
        )
    );
    return { aggregationRequests, pollRequests };
};

describe("Search external sources", () => {
    jest.setTimeout(15000);

    beforeEach(() => {
        resetSearchTestState();
    });

    it("polls for partner results and shows the partner banner", async () => {
        const { pollRequests } = mockExternalSearch();

        renderSearch("/search?type=datasets&query=asthma");

        expect(
            await screen.findByRole(
                "button",
                { name: tBanner.viewPartnerResources },
                { timeout: POLL_TIMEOUT }
            )
        ).toBeInTheDocument();
        await waitFor(
            () =>
                expect(
                    screen.getByText(`7 ${tBanner.partnerResources}`)
                ).toBeInTheDocument(),
            { timeout: POLL_TIMEOUT }
        );
        expect(
            screen.getByDisplayValue("ARDC").closest("label")
        ).toHaveTextContent(/7$/);
        expect(pollRequests[0]).toContain(
            "/search/aggregation/results/token-1"
        );
    });

    it("switches to partner results", async () => {
        const { aggregationRequests } = mockExternalSearch();
        renderSearch("/search?type=datasets&query=asthma&page=2");

        fireEvent.click(
            await screen.findByRole(
                "button",
                { name: tBanner.viewPartnerResources },
                { timeout: POLL_TIMEOUT }
            )
        );

        await waitFor(() =>
            expect(urlParams()).toEqual({
                type: "datasets",
                query: "asthma",
                dataSource: "ARDC",
            })
        );
        await waitFor(() =>
            expect(
                aggregationRequests[aggregationRequests.length - 1].body
            ).toMatchObject({ dataSource: "ARDC", page: "1" })
        );
        expect(
            await screen.findByText("ARDC dataset 1", undefined, {
                timeout: POLL_TIMEOUT,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: t.viewAllPartnerResults })
        ).toHaveAttribute(
            "href",
            "https://researchdata.edu.au/health/search?filter-type=all-fields&q=asthma"
        );
        expect(screen.getByText(t.partnerDatasetsNewTab)).toBeInTheDocument();
        expect(
            screen.queryByRole("navigation", { name: "pagination" })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: t.downloadResults })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", {
                name: t.components.Search.toggleLabelList,
            })
        ).not.toBeInTheDocument();
    });

    it("polls with the token from the server results", async () => {
        const { aggregationRequests, pollRequests } = mockExternalSearch();
        const queryParams = parseQueryParams(
            new URLSearchParams("type=datasets&query=asthma")
        );

        renderSearch("/search?type=datasets&query=asthma", undefined, {
            initialResults: {
                key: unstable_serialize([
                    apis.searchV2AggregationUrl,
                    getV2SearchBody(
                        queryParams,
                        getSearchMode(queryParams, typesenseSearchFlags)
                    ),
                ]),
                data: generateSearchV2Response(SearchCategory.DATASETS, {
                    token: "token-1",
                    pending: ["ARDC"],
                }),
            },
        });

        await waitFor(() => expect(pollRequests.length).toBeGreaterThan(0), {
            timeout: POLL_TIMEOUT,
        });
        expect(aggregationRequests).toHaveLength(0);
    });
});
