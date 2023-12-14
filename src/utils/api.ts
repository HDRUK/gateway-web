import { Role } from "@/interfaces/Role";
import { fePermissions } from "@/consts/permissions";
import { ROLE_HDRUK_SUPERADMIN } from "@/consts/roles";
import apis from "@/config/apis";
import config from "@/config/config";
import { getUserFromToken } from "@/utils/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { AuthUser } from "@/interfaces/AuthUser";
import { Team } from "@/interfaces/Team";
import { Application } from "@/interfaces/Application";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { HttpOptions } from "@/interfaces/Api";

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

async function get<T>(
    cookieStore: ReadonlyRequestCookies,
    url: string
): Promise<T> {
    const jwt = cookieStore.get(config.JWT_COOKIE);

    const res = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${jwt?.value}` },
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    const { data } = await res.json();

    return data;
}

async function getUser(cookieStore: ReadonlyRequestCookies): Promise<AuthUser> {
    const jwt = cookieStore.get(config.JWT_COOKIE);
    const authUser = getUserFromToken(jwt?.value);
    return get<AuthUser>(cookieStore, `${apis.usersV1UrlIP}/${authUser?.id}`);
}

async function getApplication(
    cookieStore: ReadonlyRequestCookies,
    applicationId: string
): Promise<Application> {
    return get<Application>(
        cookieStore,
        `${apis.applicationsV1UrlIP}/${applicationId}`
    );
}

async function getCohort(
    cookieStore: ReadonlyRequestCookies,
    cohortId: string
): Promise<CohortRequest> {
    return get<CohortRequest>(
        cookieStore,
        `${apis.cohortRequestsV1UrlIP}/${cohortId}`
    );
}

async function getTeam(
    cookieStore: ReadonlyRequestCookies,
    teamId: string
): Promise<Team> {
    const team = await get<Team>(cookieStore, `${apis.teamsV1UrlIP}/${teamId}`);

    return {
        ...team,
        users: team?.users.map(user => ({
            ...user,
            roles: user.roles.filter(
                // Remove global "hdruk" roles from team users
                role => !role.name.startsWith("hdruk")
            ),
        })),
    };
}

const ThrowPaginationError = (options: HttpOptions | undefined) => {
    if (
        (options?.withPagination && !options?.paginationKey) ||
        (options?.paginationKey && !options?.withPagination)
    ) {
        throw Error(
            "You must provide both paginationKey and withPagination=true"
        );
    }
};

export {
    getPermissions,
    getUser,
    getTeam,
    getApplication,
    getCohort,
    ThrowPaginationError,
};
