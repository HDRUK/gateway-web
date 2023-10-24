import { useRouter } from "next/router";
import { getPermissions } from "@/utils/permissions";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import useAuth from "./useAuth";
import { useGetTeam } from "./useGetTeam";

export const useHasPermissions = () => {
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;

    const { team } = useGetTeam(teamId);

    const { user } = useAuth();
    const foundUser = team?.users?.find(teamUser => teamUser.id === user?.id);

    return getPermissions(user?.roles, foundUser?.roles);
};
