import { rest } from "msw";
import apis from "@/config/apis";
import { fireEvent, render, screen } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import DataCustodianNetwork from "./DataCustodianNetwork";

jest.mock("@/providers/FeatureProvider", () => ({
    useFeatures: jest.fn().mockReturnValue({ isTypesenseSearchEnabled: false }),
}));

const DCN_URL = `${apis.searchV1Url}/data_custodian_networks`;

const mockEndpoint = (requestQueries: string[], total = 1) => {
    server.use(
        rest.post(DCN_URL, async (req, res, ctx) => {
            const body = await req.json();
            requestQueries.push(body.query);
            const page = Number(req.url.searchParams.get("page")) || 1;
            return res(
                ctx.status(200),
                ctx.json({
                    data: [
                        {
                            id: page,
                            name: `Network for ${body.query} page ${page}`,
                        },
                    ],
                    current_page: page,
                    last_page: Math.ceil(total / 4),
                    total,
                })
            );
        })
    );
};

const mockAggregationEndpoint = (
    requestBodies: { page?: number }[],
    total = 1
) => {
    server.use(
        rest.post(apis.searchV2AggregationUrl, async (req, res, ctx) => {
            const body = await req.json();
            requestBodies.push(body);
            return res(
                ctx.status(200),
                ctx.json({
                    data: {
                        query: body.query,
                        type: body.type,
                        results: {
                            HDRUK: {
                                hits: [
                                    {
                                        id: body.page,
                                        name: `Network for ${body.query} page ${body.page}`,
                                        img_url: "",
                                    },
                                ],
                                total,
                                aggregations: [],
                                ids: ["1"],
                            },
                        },
                    },
                })
            );
        })
    );
};

describe("DataCustodianNetwork", () => {
    it("fetches results on mount and renders them", async () => {
        const requestQueries: string[] = [];
        mockEndpoint(requestQueries);

        render(<DataCustodianNetwork searchParams={{ query: "cancer" }} />);

        expect(
            await screen.findByText("Network for cancer page 1")
        ).toBeInTheDocument();
        expect(requestQueries).toEqual(["cancer"]);
    });

    it("issues a single request per search when the query changes", async () => {
        const requestQueries: string[] = [];
        mockEndpoint(requestQueries);

        const { rerender } = render(
            <DataCustodianNetwork searchParams={{ query: "cancer" }} />
        );
        expect(
            await screen.findByText("Network for cancer page 1")
        ).toBeInTheDocument();

        rerender(<DataCustodianNetwork searchParams={{ query: "diabetes" }} />);
        expect(
            await screen.findByText("Network for diabetes page 1")
        ).toBeInTheDocument();

        expect(requestQueries).toEqual(["cancer", "diabetes"]);
    });

    it("calls the v2 aggregation endpoint when TypesenseSearch is enabled", async () => {
        const { useFeatures } = require("@/providers/FeatureProvider");
        useFeatures.mockReturnValue({ isTypesenseSearchEnabled: true });

        const requestBodies: {
            type?: string;
            view_type?: string;
            per_page?: number;
            page?: number;
            filters?: unknown;
        }[] = [];
        mockAggregationEndpoint(requestBodies);

        render(
            <DataCustodianNetwork
                searchParams={{
                    query: "cancer",
                    filters: {
                        collection: { datasetTitles: ["Dataset A"] },
                    },
                }}
            />
        );

        expect(
            await screen.findByText("Network for cancer page 1")
        ).toBeInTheDocument();
        expect(requestBodies).toHaveLength(1);
        expect(requestBodies[0]).toMatchObject({
            type: "data_custodian_networks",
            view_type: "mini",
            per_page: 4,
            filters: {
                datacustodiannetwork: { datasetTitles: ["Dataset A"] },
            },
        });
    });

    it("paginates through v1 results when there are more than fit on one page", async () => {
        const { useFeatures } = require("@/providers/FeatureProvider");
        useFeatures.mockReturnValue({ isTypesenseSearchEnabled: false });

        const requestQueries: string[] = [];
        mockEndpoint(requestQueries, 8);

        render(<DataCustodianNetwork searchParams={{ query: "cancer" }} />);

        expect(
            await screen.findByText("Network for cancer page 1")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText("2"));

        expect(
            await screen.findByText("Network for cancer page 2")
        ).toBeInTheDocument();
    });

    it("resets to page 1 when the query changes after paginating", async () => {
        const { useFeatures } = require("@/providers/FeatureProvider");
        useFeatures.mockReturnValue({ isTypesenseSearchEnabled: false });

        const requestQueries: string[] = [];
        mockEndpoint(requestQueries, 8);

        const { rerender } = render(
            <DataCustodianNetwork searchParams={{ query: "cancer" }} />
        );
        expect(
            await screen.findByText("Network for cancer page 1")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText("2"));
        expect(
            await screen.findByText("Network for cancer page 2")
        ).toBeInTheDocument();

        rerender(<DataCustodianNetwork searchParams={{ query: "diabetes" }} />);

        expect(
            await screen.findByText("Network for diabetes page 1")
        ).toBeInTheDocument();
    });

    it("paginates through v2 results when there are more than fit on one page", async () => {
        const { useFeatures } = require("@/providers/FeatureProvider");
        useFeatures.mockReturnValue({ isTypesenseSearchEnabled: true });

        const requestBodies: { page?: number }[] = [];
        mockAggregationEndpoint(requestBodies, 8);

        render(<DataCustodianNetwork searchParams={{ query: "cancer" }} />);

        expect(
            await screen.findByText("Network for cancer page 1")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText("2"));

        expect(
            await screen.findByText("Network for cancer page 2")
        ).toBeInTheDocument();
        expect(requestBodies[requestBodies.length - 1]).toMatchObject({
            page: 2,
        });
    });
});
