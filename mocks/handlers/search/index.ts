import { rest } from "msw";
import { SearchAggregationData, SearchPollData } from "@/interfaces/Search";
import apis from "@/config/apis";
import { SearchV1Response } from "@/mocks/data/search";

export interface RecordedRequest {
    path: string;
    searchParams: Record<string, string>;
    body: Record<string, unknown>;
}

const record = async (
    req: { url: URL; json: () => Promise<unknown> },
    requests: RecordedRequest[]
) => {
    const body = (await req.json()) as Record<string, unknown>;
    const entry = {
        path: req.url.pathname,
        searchParams: Object.fromEntries(req.url.searchParams.entries()),
        body,
    };
    requests.push(entry);
    return entry;
};

const postSearchV1 = (
    type: string,
    response:
        | SearchV1Response
        | string
        | ((request: RecordedRequest) => SearchV1Response),
    requests: RecordedRequest[] = []
) =>
    rest.post(`${apis.searchV1Url}/${type}`, async (req, res, ctx) => {
        const entry = await record(req, requests);

        if (typeof response === "string") {
            return res(
                ctx.status(200),
                ctx.set("Content-Type", "text/csv"),
                ctx.body(response)
            );
        }

        return res(
            ctx.status(200),
            ctx.json(
                typeof response === "function" ? response(entry) : response
            )
        );
    });

const postSearchV2Aggregation = (
    response:
        | SearchAggregationData
        | ((request: RecordedRequest) => SearchAggregationData),
    requests: RecordedRequest[] = [],
    type?: string
) =>
    rest.post(apis.searchV2AggregationUrl, async (req, res, ctx) => {
        const { type: requestType } = await req.clone().json();
        if (type && requestType !== type) {
            return undefined;
        }

        const entry = await record(req, requests);

        return res(
            ctx.status(200),
            ctx.json({
                message: "success",
                data:
                    typeof response === "function" ? response(entry) : response,
            })
        );
    });

const getSearchV2AggregationResults = (
    token: string,
    response: SearchPollData,
    requests: string[] = []
) =>
    rest.get(
        `${apis.searchV2AggregationResultsUrl}/${token}`,
        (req, res, ctx) => {
            requests.push(req.url.pathname);
            return res(ctx.status(200), ctx.json({ data: response }));
        }
    );

const postSavedSearchV1 = (requests: RecordedRequest[] = []) =>
    rest.post(apis.saveSearchesV1Url, async (req, res, ctx) => {
        await record(req, requests);
        return res(ctx.status(200), ctx.json({ data: 1 }));
    });

export {
    getSearchV2AggregationResults,
    postSavedSearchV1,
    postSearchV1,
    postSearchV2Aggregation,
};
