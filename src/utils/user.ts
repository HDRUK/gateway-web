import { AuthTeam } from "@/interfaces/AuthTeam";
import { AuthUser } from "@/interfaces/AuthUser";

const getTeamById = (
    teams: AuthTeam[] | undefined,
    teamId: number | string
) => {
    if (!Array.isArray(teams) || !teamId) return undefined;
    return teams?.find(team => team.id === parseInt(teamId as string, 10));
};

const getRoleNamesByTeam = (team: AuthTeam | undefined | null) => {
    if (!team?.roles) return [];

    const { roles } = team;
    return roles.map(role => role.name);
};

const getProfileEmail = (user: AuthUser) => {
    const { preferred_email, secondary_email, email } = user;
    return preferred_email === "secondary" ? secondary_email : email;
};
export { getTeamById, getRoleNamesByTeam, getProfileEmail };
