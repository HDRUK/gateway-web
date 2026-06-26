import { rest } from "msw";
import apis from "@/config/apis";
import { server } from "@/mocks/server";
import { render, screen } from "@/utils/testUtils";
import DataCustodianNetwork from "./DataCustodianNetwork";

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
});
