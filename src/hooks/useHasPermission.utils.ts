import { Role } from "@/interfaces/Role";
import permissions from "@/consts/permissions";

const getPermissions = (userRoles: Role[], teamRoles: string[]) => {
    const enabledUserRoles = userRoles
        .filter(authRoles => authRoles.enabled)
        .map(authRoles => authRoles.name);

    const allRoles = [...teamRoles, ...enabledUserRoles];

    const permissionObj: { [key: string]: boolean } = {};

    Object.keys(permissions).forEach(key => {
        permissionObj[key] = allRoles.some(role =>
            permissions[key as keyof typeof permissions]!.includes(role)
        );
    });

    return permissionObj;
};

export { getPermissions };
