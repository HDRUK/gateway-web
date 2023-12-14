import { Role } from "@/interfaces/Role";
import { fePermissions } from "@/consts/permissions";
import { ROLE_HDRUK_SUPERADMIN } from "@/consts/roles";

const getPermissions = (
    userRoles: Role[] = [],
    teamUserRoles: Role[] | undefined = []
) => {
    const enabledUserRoles = userRoles.filter(userRole => userRole.enabled);
    const enabledTeamUserRoles = teamUserRoles.filter(
        TeamUserRole => TeamUserRole.enabled
    );

    const userRoleNames = enabledUserRoles.map(
        enabledUserRole => enabledUserRole.name
    );
    const teamUserRoleNames = enabledTeamUserRoles.map(
        teamUserRole => teamUserRole.name
    );

    // combines team user roles and root user roles
    const allRoles = [...teamUserRoleNames, ...userRoleNames];

    const permissionObj: { [key: string]: boolean } = {};

    // adds all fe.** permissions
    Object.keys(fePermissions).forEach(key => {
        if (allRoles.includes(ROLE_HDRUK_SUPERADMIN)) {
            // gives "hdruk.superadmin" access to all fe.**
            permissionObj[key] = true;
        } else {
            permissionObj[key] = allRoles.some(role =>
                fePermissions[key as keyof typeof fePermissions]!.includes(role)
            );
        }
    });

    // gets all team user permissions
    const teamUserPermissions = teamUserRoles
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
