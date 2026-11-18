import { rest } from "msw";
import { SearchAggregationData, SearchPollData } from "@/interfaces/Search";
import apis from "@/config/apis";

type SearchBody = Record<string, unknown>;

const postSearchV2Aggregation = (
    response: (body: SearchBody) => SearchAggregationData,
    requests: SearchBody[] = []
) =>
    rest.post(apis.searchV2AggregationUrl, async (req, res, ctx) => {
        const body = await req.json();
        requests.push(body);

        return res(
            ctx.status(200),
            ctx.json({ message: "success", data: response(body) })
        );
    });

const getSearchV2AggregationResults = (response: SearchPollData) =>
    rest.get(`${apis.searchV2AggregationResultsUrl}/:token`, (_req, res, ctx) =>
        res(ctx.status(200), ctx.json({ message: "success", data: response }))
    );

export { getSearchV2AggregationResults, postSearchV2Aggregation };
export type { SearchBody };
