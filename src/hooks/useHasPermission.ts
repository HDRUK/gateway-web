import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { getPermissions } from "@/utils/permissions";
import { Team } from "@/interfaces/Team";
import apis from "@/config/apis";
import useAuth from "./useAuth";
import useGet from "./useGet";

interface AccountTeamUrlQuery extends ParsedUrlQuery {
    teamId: string;
}

export const useHasPermissions = () => {
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;
    const { data: team } = useGet<Team>(
        teamId ? `${apis.teamsV1Url}/${teamId}` : null
    );

    const { user } = useAuth();
    const foundUser = team?.users.find(teamUser => teamUser.id === user?.id);

    return getPermissions(user?.roles, foundUser?.roles);
};
