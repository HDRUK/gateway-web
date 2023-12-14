"use client";

import { getPermissions } from "@/utils/api";
import useGetTeam from "@/hooks/useGetTeam";
import useAuth from "@/hooks/useAuth";
import { useParams } from "next/navigation";

export const useHasPermissions = () => {
    const { teamId } = useParams();
    const { team } = useGetTeam(teamId as string);

    const { user } = useAuth();
    const foundUser = team?.users?.find(teamUser => teamUser.id === user?.id);

    return getPermissions(user?.roles, foundUser?.roles);
};
