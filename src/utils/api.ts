import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { Application } from "@/interfaces/Application";
import { AuthUser } from "@/interfaces/AuthUser";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { Collection } from "@/interfaces/Collection";
import { DataUse } from "@/interfaces/DataUse";
import { Dataset } from "@/interfaces/Dataset";
import { Filter } from "@/interfaces/Filter";
import { FormHydrationSchema } from "@/interfaces/FormHydration";
import { Team } from "@/interfaces/Team";
import { TeamSummary } from "@/interfaces/TeamSummary";
import { Tool } from "@/interfaces/Tool";
import apis from "@/config/apis";
import config from "@/config/config";
import { FILTERS_PER_PAGE } from "@/config/request";
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
    return get<Filter[]>(
        cookieStore,
        `${apis.filtersV1UrlIP}?perPage=${FILTERS_PER_PAGE}`
    );
}

async function getEntityAction(
    cookieStore: ReadonlyRequestCookies
): Promise<string | undefined> {
    return cookieStore.get(config.ENTITY_ACTION_COOKIE.COOKIE_NAME)?.value;
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

async function getTeamSummary(
    cookieStore: ReadonlyRequestCookies,
    teamId: string
): Promise<TeamSummary> {
    return await get<TeamSummary>(
        cookieStore,
        `${apis.teamsV1UrlIP}/${teamId}/summary`
    );
}

async function getDataset(
    cookieStore: ReadonlyRequestCookies,
    datasetId: string,
    schemaModel?: string,
    schemaVersion?: string
): Promise<Dataset> {
    const baseUrl = `${apis.datasetsV1UrlIP}/${datasetId}`;
    const params = new URLSearchParams();

    if (schemaModel && schemaVersion) {
        params.append("schema_model", schemaModel);
        params.append("schema_version", schemaVersion);
    }
    const queryString = params.toString();

    return await get<Dataset>(
        cookieStore,
        queryString ? `${baseUrl}?${queryString}` : baseUrl
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

async function getTool(
    cookieStore: ReadonlyRequestCookies,
    toolId: string
): Promise<Tool> {
    const tool = await get<Tool>(cookieStore, `${apis.toolsV1UrlIP}/${toolId}`);

    return tool;
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

async function getFormHydration(
    cookieStore: ReadonlyRequestCookies,
    schemaName: string,
    schemaVersion: string
): Promise<FormHydrationSchema> {
    return get<FormHydrationSchema>(
        cookieStore,
        `${apis.formHydrationV1UrlIP}?name=${schemaName}&version=${schemaVersion}`
    );
}

export {
    getFilters,
    getUser,
    getTeam,
    getTeamSummary,
    getApplication,
    getCohort,
    getDataset,
    getDataUse,
    getTool,
    getCollection,
    getFormHydration,
    getEntityAction,
};
