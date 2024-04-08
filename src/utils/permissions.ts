import { Role } from "@/interfaces/Role";

const getPermissions = (
    userRoles: Role[] = [],
    teamUserRoles: Role[] | undefined = []
) => {
    const enabledUserRoles = userRoles.filter(userRole => userRole.enabled);
    const enabledTeamUserRoles = teamUserRoles.filter(
        TeamUserRole => TeamUserRole.enabled
    );

    const permissionObj: { [key: string]: boolean } = {};

    // gets all team user permissions
    const teamUserPermissions = enabledTeamUserRoles
        .map(enabledUserRole => enabledUserRole.permissions || [])
        .flat()
        .map(permission => permission.name);

    // gets all root user permissions
    const userPermissions = enabledUserRoles
        .map(enabledUserRole => enabledUserRole.permissions)
        .flat()
        .map(permission => permission.name);

    const uniquePermissions = [
        ...teamUserPermissions,
        ...userPermissions,
    ].filter((value, index, array) => array.indexOf(value) === index);

    uniquePermissions.forEach(uniquePermission => {
        permissionObj[uniquePermission] = true;
    });

    return permissionObj;
};

export { getPermissions };
