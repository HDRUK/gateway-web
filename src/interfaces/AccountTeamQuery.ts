import { ParsedUrlQuery } from "querystring";

interface AccountTeamUrlQuery extends ParsedUrlQuery {
    teamId: string;
}

interface AccountDatasetUrlQuery extends ParsedUrlQuery {
    teamId: string;
    tab: string;
}

export type { AccountTeamUrlQuery, AccountDatasetUrlQuery };
