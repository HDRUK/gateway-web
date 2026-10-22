import { ReactElement } from "react";
import { unstable_serialize } from "swr";
import { Filter } from "@/interfaces/Filter";
import { Schema } from "@/interfaces/V4Schema";
import apis from "@/config/apis";
import getSearchResults from "../../utils/getSearchResults";
import SearchLoader from "./SearchLoader";

jest.mock("../Search", () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock("../../utils/getSearchResults", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockGetFeatures = jest.fn();
jest.mock("@/utils/gatewayFlagAdapter", () => ({
    getFeatures: () => mockGetFeatures(),
}));

const mockGetSearchResults = getSearchResults as jest.Mock;

const filters = [] as Filter[];
const schema = { $defs: {} } as unknown as Schema;

const load = async (params: Record<string, string>) =>
    (await SearchLoader({
        searchParams: Promise.resolve(params),
        filters,
        schema,
        initialView: "list",
    })) as ReactElement<Record<string, unknown>>;

describe("SearchLoader", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetFeatures.mockResolvedValue({
            V2_SearchAggregation: true,
            TypesenseSearch: true,
        });
        mockGetSearchResults.mockResolvedValue({ list: [] });
    });

    it("fetches the first page from the internal url and keys it by the public url", async () => {
        const { props } = await load({ type: "tools", query: "asthma" });

        const body = {
            query: "asthma",
            type: "tools",
            sort: "score:desc",
            per_page: "25",
            page: "1",
            dataSource: "HDRUK",
        };
        expect(mockGetSearchResults).toHaveBeenCalledWith({
            url: apis.searchV2AggregationUrlIP,
            body,
            withPagination: false,
        });
        expect(props.initialResults).toEqual({
            key: unstable_serialize([apis.searchV2AggregationUrl, body]),
            data: { list: [] },
        });
    });

    it("passes the page data through to the search", async () => {
        const { props } = await load({ type: "datasets" });

        expect(props).toMatchObject({ filters, schema, initialView: "list" });
    });

    it("leaves the search to the browser when the server search fails", async () => {
        mockGetSearchResults.mockResolvedValue(undefined);

        const { props } = await load({ type: "tools" });

        expect(props.initialResults).toBeUndefined();
    });

    it("does not search europe pmc on the server", async () => {
        const { props } = await load({
            type: "publications",
            source: "FED",
            query: "asthma",
        });

        expect(mockGetSearchResults).not.toHaveBeenCalled();
        expect(props.initialResults).toBeUndefined();
    });
});
