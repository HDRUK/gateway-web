import { rest } from "msw";
import apis from "@/config/apis";
import { server } from "@/mocks/server";
import { render, screen } from "@/utils/testUtils";
import DataCustodianNetwork from "./DataCustodianNetwork";

jest.mock("@/providers/FeatureProvider", () => ({
    useFeatures: jest.fn().mockReturnValue({ isTypesenseSearchEnabled: false }),
}));

const DCN_URL = `${apis.searchV1Url}/data_custodian_networks`;

const mockEndpoint = (requestQueries: string[]) => {
    server.use(
        rest.post(DCN_URL, async (req, res, ctx) => {
            const body = await req.json();
            requestQueries.push(body.query);
            return res(
                ctx.status(200),
                ctx.json({
                    data: [{ id: 1, name: `Network for ${body.query}` }],
                })
            );
        })
    );
};

const mockAggregationEndpoint = (requestBodies: unknown[]) => {
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
                                        id: 1,
                                        name: `Network for ${body.query}`,
                                        img_url: "",
                                    },
                                ],
                                total: 1,
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

        expect(await screen.findByText("Network for cancer")).toBeInTheDocument();
        expect(requestQueries).toEqual(["cancer"]);
    });

    it("issues a single request per search when the query changes", async () => {
        const requestQueries: string[] = [];
        mockEndpoint(requestQueries);

        const { rerender } = render(
            <DataCustodianNetwork searchParams={{ query: "cancer" }} />
        );
        expect(await screen.findByText("Network for cancer")).toBeInTheDocument();

        rerender(<DataCustodianNetwork searchParams={{ query: "diabetes" }} />);
        expect(
            await screen.findByText("Network for diabetes")
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

        expect(await screen.findByText("Network for cancer")).toBeInTheDocument();
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
});
