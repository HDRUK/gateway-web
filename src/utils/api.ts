import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { Application } from "@/interfaces/Application";
import { AuthUser } from "@/interfaces/AuthUser";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { ReducedCollection } from "@/interfaces/Collection";
import { DataCustodianNetwork } from "@/interfaces/DataCustodianNetwork";
import { DataUse } from "@/interfaces/DataUse";
import { Dataset } from "@/interfaces/Dataset";
import { Filter } from "@/interfaces/Filter";
import { FormHydrationSchema } from "@/interfaces/FormHydration";
import { NetworkSummary } from "@/interfaces/NetworkSummary";
import { GetOptions } from "@/interfaces/Response";
import { Team } from "@/interfaces/Team";
import { TeamSummary } from "@/interfaces/TeamSummary";
import { Tool } from "@/interfaces/Tool";
import { User } from "@/interfaces/User";
import apis from "@/config/apis";
import config from "@/config/config";
import { FILTERS_PER_PAGE } from "@/config/request";
import { getUserFromToken } from "@/utils/cookies";

async function get<T>(
    cookieStore: ReadonlyRequestCookies,
    url: string,
    options: GetOptions = {
        suppressError: false,
    }
): Promise<T> {
    const jwt = cookieStore.get(config.JWT_COOKIE);

    const res = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${jwt?.value}` },
    });

    if (!res.ok && !options.suppressError) {
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

function getUserFromCookie(cookieStore: ReadonlyRequestCookies): User | null {
    const jwt = cookieStore.get(config.JWT_COOKIE);

    return getUserFromToken(jwt?.value);
}

async function getUser(cookieStore: ReadonlyRequestCookies): Promise<AuthUser> {
    return get<AuthUser>(
        cookieStore,
        `${apis.usersV1UrlIP}/${getUserFromCookie(cookieStore)?.id}`
    );
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
    teamId: string,
    options?: GetOptions
): Promise<TeamSummary> {
    return await get<TeamSummary>(
        cookieStore,
        `${apis.teamsV1UrlIP}/${teamId}/summary`,
        options
    );
}

async function getNetworkSummary(
    cookieStore: ReadonlyRequestCookies,
    networkId: string,
    options?: GetOptions
): Promise<NetworkSummary> {
    return await get<NetworkSummary>(
        cookieStore,
        `${apis.dataCustodianNetworkV1UrlIP}/${networkId}/summary`,
        options
    );
}

async function getDataCustodianNetworks(
    cookieStore: ReadonlyRequestCookies,
    networkId: string
): Promise<DataCustodianNetwork> {
    return await get<DataCustodianNetwork>(
        cookieStore,
        `${apis.dataCustodianNetworkV1UrlIP}/${networkId}`
    );
}

async function getDataset(
    cookieStore: ReadonlyRequestCookies,
    datasetId: string,
    schemaModel?: string,
    schemaVersion?: string,
    options?: GetOptions
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
        queryString ? `${baseUrl}?${queryString}` : baseUrl,
        options
    );
}

async function getDataUse(
    cookieStore: ReadonlyRequestCookies,
    dataUseId: string,
    options?: GetOptions
): Promise<DataUse> {
    const dataUse = await get<DataUse[]>(
        cookieStore,
        `${apis.dataUseV1UrlIP}/${dataUseId}`,
        options
    );

    return dataUse?.[0];
}

async function getTool(
    cookieStore: ReadonlyRequestCookies,
    toolId: string,
    options?: GetOptions
): Promise<Tool> {
    const tool = await get<Tool>(
        cookieStore,
        `${apis.toolsV1UrlIP}/${toolId}`,
        options
    );

    return tool;
}

async function getReducedCollection(
    cookieStore: ReadonlyRequestCookies,
    collectionId: string,
    options?: GetOptions
): Promise<ReducedCollection> {
    const collection = await get<ReducedCollection>(
        cookieStore,
        `${apis.collectionsV1UrlIP}/${collectionId}?view_type=mini`,
        options
    );

    return collection;
}

async function getFormHydration(
    cookieStore: ReadonlyRequestCookies,
    schemaName: string,
    schemaVersion: string,
    dataTypes?: string[],
    teamId?: string
): Promise<FormHydrationSchema> {
    return get<FormHydrationSchema>(
        cookieStore,
        `${
            apis.formHydrationV1UrlIP
        }?name=${schemaName}&version=${schemaVersion}&dataTypes=${
            dataTypes || []
        }${teamId && `&team_id=${teamId}`}`
    );
}

export {
    getApplication,
    getCohort,
    getReducedCollection,
    getDataCustodianNetworks,
    getDataset,
    getDataUse,
    getEntityAction,
    getFilters,
    getFormHydration,
    getNetworkSummary,
    getTeam,
    getTeamSummary,
    getTool,
    getUser,
    getUserFromCookie,
};
