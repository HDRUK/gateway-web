import { ParsedUrlQuery } from "querystring";

interface AccountTeamUrlQuery extends ParsedUrlQuery {
    teamId: string;
}

export type { AccountTeamUrlQuery };
