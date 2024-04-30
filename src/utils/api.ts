import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { Application } from "@/interfaces/Application";
import { AuthUser } from "@/interfaces/AuthUser";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { Collection } from "@/interfaces/Collection";
import { DataUse } from "@/interfaces/DataUse";
import { Dataset } from "@/interfaces/Dataset";
import { Filter } from "@/interfaces/Filter";
import { Team } from "@/interfaces/Team";
import apis from "@/config/apis";
import config from "@/config/config";
import { getUserFromToken } from "@/utils/cookies";

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

async function getFilters(
    cookieStore: ReadonlyRequestCookies
): Promise<Filter[]> {
    return get<Filter[]>(cookieStore, apis.filtersV1UrlIP);
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

async function getDataset(
    cookieStore: ReadonlyRequestCookies,
    datasetId: string
): Promise<Dataset> {
    return await get<Dataset>(
        cookieStore,
        `${apis.datasetsV1UrlIP}/${datasetId}`
    );
}

async function getDataUse(
    cookieStore: ReadonlyRequestCookies,
    dataUseId: string
): Promise<DataUse> {
    const dataUse = await get<DataUse[]>(
        cookieStore,
        `${apis.dataUseV1UrlIP}/${dataUseId}`
    );

    return dataUse?.[0];
}

async function getCollection(
    cookieStore: ReadonlyRequestCookies,
    collectionId: string
): Promise<Collection> {
    const collection = await get<Collection>(
        cookieStore,
        `${apis.collectionsV1UrlIP}/${collectionId}`
    );

    return collection;
}

export {
    getFilters,
    getUser,
    getTeam,
    getApplication,
    getCohort,
    getDataset,
    getDataUse,
    getCollection,
};
