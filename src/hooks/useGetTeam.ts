import { useMemo } from "react";
import { Team } from "@/interfaces/Team";
import apis from "@/config/apis";
import useGet from "./useGet";

const useGetTeam = (teamId?: string) => {
    const { data, isLoading, mutate, ...rest } = useGet<Team>(
        teamId ? `${apis.teamsV1Url}/${teamId}` : null
    );

    const cachedTeam = useMemo(() => {
        if (!data) return undefined;
        return {
            ...data,
            users: data?.users.map(user => ({
                ...user,
                roles: user.roles.filter(
                    // Remove global "hdruk" roles from team users
                    role => !role.name.startsWith("hdruk")
                ),
            })),
        };
    }, [data]);

    return {
        team: cachedTeam,
        isTeamLoading: isLoading,
        mutateTeam: mutate,
        ...rest,
    };
};

export default useGetTeam;
