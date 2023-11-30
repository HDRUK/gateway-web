import { ParsedUrlQuery } from "querystring";

interface AccountDatasetUrlQuery extends ParsedUrlQuery {
    teamId: string;
    tab: string;
}

export type { AccountDatasetUrlQuery };
