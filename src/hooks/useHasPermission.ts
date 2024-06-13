"use client";

import { useParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import useGetTeam from "@/hooks/useGetTeam";
import { getPermissions } from "@/utils/permissions";

export const useHasPermissions = () => {
    const params = useParams<{ teamId: string }>();
    const { team } = useGetTeam(params?.teamId as string);

    const { user } = useAuth();
    const foundUser = team?.users?.find(teamUser => teamUser.id === user?.id);

    return getPermissions(user?.roles, foundUser?.roles);
};
