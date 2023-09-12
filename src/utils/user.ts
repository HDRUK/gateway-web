import { AuthTeam } from "@/interfaces/AuthTeam";

const getTeamById = (teams: AuthTeam[], teamId: number | string) => {
    if (!Array.isArray(teams) || !teamId) return null;
    return teams?.find(team => team.id === parseInt(teamId as string, 10));
};

const getRoleNamesByTeam = (team: AuthTeam | undefined | null) => {
    if (!team?.roles) return [];

    const { roles } = team;
    return roles.map(role => role.name);
};

export { getTeamById, getRoleNamesByTeam };
