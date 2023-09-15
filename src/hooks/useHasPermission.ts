import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { getPermissions } from "@/utils/permissions";
import { getTeamById } from "@/utils/user";
import useAuth from "./useAuth";

interface AccountTeamUrlQuery extends ParsedUrlQuery {
    teamId: string;
}

export const useHasPermissions = () => {
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;
    const { user } = useAuth();

    const team = getTeamById(user?.teams, teamId);

    return getPermissions(user?.roles, team?.roles);
};
