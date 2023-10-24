import apis from "@/config/apis";
import { Team } from "@/interfaces/Team";
import { useMemo } from "react";
import useGet from "./useGet";

export const useGetTeam = (teamId: string) => {
    const { data, isLoading, mutate, ...rest } = useGet<Team>(
        teamId ? `${apis.teamsV1Url}/${teamId}` : null
    );

    const cachedTeam = useMemo(
        () => ({
            ...data,
            users: data?.users.map(user => ({
                ...user,
                roles: user.roles.filter(
                    // Remove global "hdruk" roles from team users
                    role => !role.name.startsWith("hdruk")
                ),
            })),
        }),
        [data]
    );

    return {
        team: cachedTeam || {},
        isTeamLoading: isLoading,
        mutateTeam: mutate,
        ...rest,
    };
};
