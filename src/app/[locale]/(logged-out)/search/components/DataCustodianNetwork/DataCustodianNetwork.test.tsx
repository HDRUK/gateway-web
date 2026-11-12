import { rest } from "msw";
import apis from "@/config/apis";
import { fireEvent, render, screen } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import DataCustodianNetwork from "./DataCustodianNetwork";

const mockAggregationEndpoint = (
    requestBodies: { query?: string; page?: number }[],
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
        const requestBodies: { query?: string }[] = [];
        mockAggregationEndpoint(requestBodies);

        render(<DataCustodianNetwork searchParams={{ query: "cancer" }} />);

        expect(
            await screen.findByText("Network for cancer page 1")
        ).toBeInTheDocument();
        expect(requestBodies.map(body => body.query)).toEqual(["cancer"]);
    });

    it("issues a single request per search when the query changes", async () => {
        const requestBodies: { query?: string }[] = [];
        mockAggregationEndpoint(requestBodies);

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

        expect(requestBodies.map(body => body.query)).toEqual([
            "cancer",
            "diabetes",
        ]);
    });

    it("sends the network search to the v2 aggregation endpoint", async () => {
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

    it("paginates through results when there are more than fit on one page", async () => {
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

    it("resets to page 1 when the query changes after paginating", async () => {
        const requestBodies: { page?: number }[] = [];
        mockAggregationEndpoint(requestBodies, 8);

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
});
