import { Role } from "@/interfaces/Role";
import { fePermissions } from "@/consts/permissions";
import { ROLE_HDRUK_SUPERADMIN } from "@/consts/roles";
import apis from "@/config/apis";
import config from "@/config/config";
import { getUserFromToken } from "@/utils/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { AuthUser } from "@/interfaces/AuthUser";
import { Team } from "@/interfaces/Team";

const getPermissions = (
    userRoles: Role[],
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

async function getUser(cookieStore: ReadonlyRequestCookies): Promise<AuthUser> {
    const jwt = cookieStore.get(config.JWT_COOKIE);

    const authUser = getUserFromToken(jwt?.value);
    const res = await fetch(`${apis.usersV1UrlIP}/${authUser?.id}`, {
        headers: { Authorization: `Bearer ${jwt?.value}` },
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    const { data: user } = await res.json();

    return user;
}

async function getTeam(
    cookieStore: ReadonlyRequestCookies,
    teamId: string
): Promise<Team> {
    const jwt = cookieStore.get(config.JWT_COOKIE);

    const res = await fetch(`${apis.teamsV1UrlIP}/${teamId}`, {
        headers: { Authorization: `Bearer ${jwt?.value}` },
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    const { data: team } = await res.json();

    return team;
}

export { getPermissions, getUser, getTeam };
