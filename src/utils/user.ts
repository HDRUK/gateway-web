import { Team } from "@/interfaces/Team";

const getTeamById = (teams: Team[], teamId: number | string) => {
    if (!Array.isArray(teams) || !teamId) return null;
    return teams?.find(team => team.id === parseInt(teamId as string, 10));
};

const getRoleNamesByTeam = (team: Team | undefined | null) => {
    if (!team?.roles) return [];

    const { roles } = team;
    return roles.map(role => role.name);
};

export { getTeamById, getRoleNamesByTeam };
