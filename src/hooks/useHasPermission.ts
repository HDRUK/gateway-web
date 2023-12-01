"use client";

import { getPermissions } from "@/utils/permissions";
import useGetTeam from "@/hooks/useGetTeam";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";

export const useHasPermissions = () => {
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;

    const { team } = useGetTeam(teamId);

    const { user } = useAuth();
    const foundUser = team?.users?.find(teamUser => teamUser.id === user?.id);

    return getPermissions(user?.roles, foundUser?.roles);
};
