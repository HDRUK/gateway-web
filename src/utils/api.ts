import apis from "@/config/apis";
import config from "@/config/config";
import { getUserFromToken } from "@/utils/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { AuthUser } from "@/interfaces/AuthUser";
import { Team } from "@/interfaces/Team";
import { Application } from "@/interfaces/Application";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { HttpOptions } from "@/interfaces/Api";

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

export { getUser, getTeam, getApplication, getCohort, ThrowPaginationError };
