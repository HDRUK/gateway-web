"use client";

import { useSearchParams } from "next/navigation";
import { getPermissions } from "@/utils/permissions";
import useGetTeam from "@/hooks/useGetTeam";
import useAuth from "@/hooks/useAuth";

export const useHasPermissions = () => {
    const searchParams = useSearchParams();
    const teamId = searchParams.get("teamId") as string;

    const { team } = useGetTeam(teamId);

    const { user } = useAuth();
    const foundUser = team?.users?.find(teamUser => teamUser.id === user?.id);

    return getPermissions(user?.roles, foundUser?.roles);
};
