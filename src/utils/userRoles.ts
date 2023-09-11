import { Role } from "@/interfaces/Role";
import { Team } from "@/interfaces/Team";
import { User } from "@/interfaces/User";

type RoleType = { [key: string]: boolean };

interface Payload {
    userId: number;
    roles: RoleType;
}

const findUserById = (team: Team, userId: number) => {
    return team?.users.find(user => user.id === userId);
};

const filterEnabledRoles = (
    roles: Role[],
    userId: number,
    team: Team
): RoleType => {
    return roles.reduce((result, role) => {
        if (
            role.enabled ||
            findUserById(team, userId)?.roles.some(r => r.name === role.name)
        ) {
            return {
                ...result,
                [role.name]: role.enabled,
            };
        }
        return result;
    }, {} as RoleType);
};

const getChangedRoles = (
    initialRoles: RoleType,
    updatedRoles: RoleType
): RoleType => {
    const changedRoles: RoleType = {};

    Object.keys(updatedRoles).forEach(roleName => {
        if (initialRoles[roleName] !== updatedRoles[roleName]) {
            changedRoles[roleName] = updatedRoles[roleName];
        }
    });

    return changedRoles;
};

const getDifferences = (updatedData: User[], team: Team) => {
    const initialUsers = team.users.map(user => ({
        userId: user.id,
        roles: filterEnabledRoles(user.roles, user.id, team),
    }));

    const updatedUsers = updatedData.map(user => ({
        userId: user.id,
        roles: filterEnabledRoles(user.roles, user.id, team),
    }));

    const changedRoles: Payload[] = [];
    const allRoles: Payload[] = [];

    initialUsers.forEach((initialUser, index) => {
        const changedUserRoles = getChangedRoles(
            initialUser.roles,
            updatedUsers[index].roles
        );

        if (Object.keys(changedUserRoles).length > 0) {
            changedRoles.push({
                userId: initialUser.userId,
                roles: changedUserRoles,
            });
            allRoles.push({
                userId: initialUser.userId,
                roles: { ...initialUser.roles, ...changedUserRoles },
            });
        }
    });

    return { changedRoles, allRoles };
};

const getChangeCount = (payloads: Payload[]): number => {
    return payloads
        .map(payload => Object.keys(payload.roles).length)
        .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);
};

export { getDifferences, getChangeCount };
