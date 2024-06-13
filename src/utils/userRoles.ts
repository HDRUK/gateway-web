import { Role } from "@/interfaces/Role";
import { User } from "@/interfaces/User";

export type RoleType = { [key: string]: boolean };

export interface RolesPayload {
    userId: number;
    roles: RoleType;
}

const findUserById = (users: User[], userId: number) => {
    return users.find(user => user.id === userId);
};

const filterEnabledRoles = (
    roles: Role[],
    userId: number,
    users: User[]
): RoleType => {
    return roles.reduce((result, role) => {
        if (
            role.enabled ||
            findUserById(users, userId)?.roles.some(r => r.name === role.name)
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

const getDifferences = (updatedData: User[] = [], users: User[] = []) => {
    const initialUsers = users.map(user => ({
        userId: user.id,
        roles: filterEnabledRoles(user.roles, user.id, users),
    }));

    const updatedUsers = updatedData.map(user => ({
        userId: user.id,
        roles: filterEnabledRoles(user.roles, user.id, users),
    }));

    const changedRoles: RolesPayload[] = [];
    const allRoles: RolesPayload[] = [];

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

const getChangeCount = (payloads: RolesPayload[]): number => {
    return payloads
        .map(payload => Object.keys(payload.roles).length)
        .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);
};

export {
    getDifferences,
    getChangeCount,
    findUserById,
    filterEnabledRoles,
    getChangedRoles,
};
