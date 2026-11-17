import { AuthTeam } from "@/interfaces/AuthTeam";
import { AuthUser } from "@/interfaces/AuthUser";
import { User } from "@/interfaces/User";
import { ValueType } from "@/components/Autocomplete/Autocomplete";
import { ROLE_CUSTODIAN_TEAM_ADMIN } from "@/consts/roles";

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

const getTeamUser = (teamUsers: User[], userId: number) =>
    teamUsers.find(teamUser => teamUser.id === userId);

const getAvailableUsers = (teamUsers: User[], allUsers: User[]) => {
    const teamUserIds = teamUsers.map(user => user.id);
    return allUsers
        .filter(user => ![...teamUserIds].includes(user.id))
        .map(user => ({
            value: user.id as ValueType,
            label: `${user.name} (${user.email})`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
};

const getPreferredEmail = (user: AuthUser) => {
    const { preferred_email, secondary_email, email } = user;
    return preferred_email === "secondary" ? secondary_email : email;
};

const getEmails = (user: AuthUser) => {
    const { preferred_email, secondary_email, email } = user;

    if (secondary_email) {
        return preferred_email === "secondary"
            ? [secondary_email, email]
            : [email, secondary_email];
    }

    return [email];
};

const getTeamAdmins = (users: User[]) => {
    const usersWithAdmins = users
        .filter(
            user =>
                user.roles.filter(
                    role => role.name === ROLE_CUSTODIAN_TEAM_ADMIN
                ).length > 0
        )
        .map(user => user.name);
    return usersWithAdmins;
};

export {
    getAvailableUsers,
    getTeamUser,
    getTeamById,
    getRoleNamesByTeam,
    getPreferredEmail,
    getTeamAdmins,
    getEmails,
};
