"use server";

import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { Application } from "@/interfaces/Application";
import { AuthUser } from "@/interfaces/AuthUser";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { ReducedCollection } from "@/interfaces/Collection";
import { DarApplicationAnswer } from "@/interfaces/DataAccessRequest";
import {
    DarTeamApplication,
    DataAccessRequestApplication,
} from "@/interfaces/DataAccessRequestApplication";
import { DarReviewsResponse } from "@/interfaces/DataAccessReview";
import { DataCustodianNetwork } from "@/interfaces/DataCustodianNetwork";
import { DataUse } from "@/interfaces/DataUse";
import { Dataset } from "@/interfaces/Dataset";
import { Filter } from "@/interfaces/Filter";
import { FormHydrationSchema } from "@/interfaces/FormHydration";
import { Keyword } from "@/interfaces/Keyword";
import { NetworkSummary } from "@/interfaces/NetworkSummary";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import { GetOptions, Cache } from "@/interfaces/Response";
import { Team } from "@/interfaces/Team";
import { TeamSummary } from "@/interfaces/TeamSummary";
import { Tool } from "@/interfaces/Tool";
import { User } from "@/interfaces/User";
import apis from "@/config/apis";
import config from "@/config/config";
import { FILTERS_PER_PAGE } from "@/config/request";
import {
    CACHE_DAR,
    CACHE_DAR_SECTIONS,
    CACHE_DAR_APPLICATION,
    CACHE_DAR_ANSWERS,
    CACHE_DAR_REVIEWS,
} from "@/consts/cache";
import { getUserFromToken } from "@/utils/cookies";
import { revalidateCache } from "./revalidateCache";

type Payload<T> = T | (() => BodyInit & T);

async function get<T>(
    cookieStore: ReadonlyRequestCookies,
    url: string,
    options: GetOptions = {
        suppressError: false,
        cache: undefined,
    }
): Promise<T> {
    const jwt = cookieStore.get(config.JWT_COOKIE);
    const { cache, suppressError } = options;
    const nextConfig = cache
        ? {
              next: {
                  tags: [...cache.tags, "all"],
                  revalidate: cache.revalidate || 2 * 60 * 60,
              },
          }
        : undefined;

    const res = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${jwt?.value}` },
        ...nextConfig,
    });

    if (!res.ok && !suppressError) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    const { data } = await res.json();
    return data;
}

async function patch<T>(
    url: string,
    payload?: Payload<T>,
    tagsToRevalidate?: string[]
): Promise<T> {
    const jwt = cookies().get(config.JWT_COOKIE);

    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${jwt?.value}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to patch data");
    }

    if (tagsToRevalidate?.length) {
        revalidateCache(tagsToRevalidate);
    }

    const { data } = await res.json();
    return data;
}

async function put<T>(
    url: string,
    payload: unknown,
    tagsToRevalidate?: string[]
): Promise<T> {
    const jwt = cookies().get(config.JWT_COOKIE);

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${jwt?.value}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to patch data");
    }

    if (tagsToRevalidate?.length) {
        revalidateCache(tagsToRevalidate);
    }

    const { data } = await res.json();
    return data;
}

async function post<T>(
    url: string,
    payload: unknown,
    tagsToRevalidate?: string[]
): Promise<T> {
    const jwt = cookies().get(config.JWT_COOKIE);

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt?.value}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to patch data");
    }

    if (tagsToRevalidate?.length) {
        revalidateCache(tagsToRevalidate);
    }

    const { data } = await res.json();
    return data;
}

async function getFilters(
    cookieStore: ReadonlyRequestCookies
): Promise<Filter[]> {
    const cache: Cache = {
        tags: ["filters"],
    };
    return get<Filter[]>(
        cookieStore,
        `${apis.filtersV1UrlIP}?perPage=${FILTERS_PER_PAGE}`,
        { cache }
    );
}

async function getKeywords(
    cookieStore: ReadonlyRequestCookies
): Promise<Keyword[]> {
    const cache: Cache = {
        tags: ["keywords"],
    };
    return get<Keyword[]>(cookieStore, `${apis.keywordsV1IPUrl}?perPage=-1`, {
        cache,
    });
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

async function getTeamIdFromPid(
    cookieStore: ReadonlyRequestCookies,
    teamPid: string
): Promise<string> {
    return await get<string>(cookieStore, `${apis.teamsV1UrlIP}/${teamPid}/id`);
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

async function getDarSections(
    cookieStore: ReadonlyRequestCookies
): Promise<QuestionBankSection[]> {
    return get<QuestionBankSection[]>(
        cookieStore,
        apis.dataAccessSectionV1UrlIP,
        {
            cache: {
                tags: [CACHE_DAR, CACHE_DAR_SECTIONS],
                revalidate: 4 * 60 * 60,
            },
        }
    );
}

async function getDarTeamApplication(
    cookieStore: ReadonlyRequestCookies,
    applicationId: string,
    teamId: string
): Promise<DataAccessRequestApplication | null> {
    return get<DataAccessRequestApplication>(
        cookieStore,
        `${apis.teamsV1UrlIP}/${teamId}/dar/applications/${applicationId}`,
        {
            cache: {
                tags: [CACHE_DAR, `${CACHE_DAR_APPLICATION}${applicationId}`],
            },
        }
    );
}

async function getDarApplicationUser(
    cookieStore: ReadonlyRequestCookies,
    applicationId: string,
    userId: string
): Promise<DataAccessRequestApplication | null> {
    return get<DataAccessRequestApplication>(
        cookieStore,
        `${apis.usersV1UrlIP}/${userId}/dar/applications/${applicationId}`,
        {
            cache: {
                tags: [CACHE_DAR, `${CACHE_DAR_APPLICATION}${applicationId}`],
            },
        }
    );
}

async function getDarAnswersTeam(
    cookieStore: ReadonlyRequestCookies,
    applicationId: string,
    teamId: string
): Promise<DarApplicationAnswer[]> {
    return get<DarApplicationAnswer[]>(
        cookieStore,
        `${apis.teamsV1UrlIP}/${teamId}/dar/applications/${applicationId}/answers`,
        {
            cache: {
                tags: [
                    CACHE_DAR,
                    CACHE_DAR_ANSWERS,
                    `${CACHE_DAR_ANSWERS}${applicationId}`,
                ],
            },
        }
    );
}

async function getDarAnswersUser(
    cookieStore: ReadonlyRequestCookies,
    applicationId: string,
    userId: string
): Promise<DarApplicationAnswer[]> {
    return get<DarApplicationAnswer[]>(
        cookieStore,
        `${apis.usersV1UrlIP}/${userId}/dar/applications/${applicationId}/answers`,
        {
            cache: {
                tags: [
                    CACHE_DAR,
                    CACHE_DAR_ANSWERS,
                    `${CACHE_DAR_ANSWERS}${applicationId}`,
                ],
            },
        }
    );
}

async function getDarReviewsTeam(
    cookieStore: ReadonlyRequestCookies,
    applicationId: string,
    teamId: string
): Promise<DarReviewsResponse[]> {
    return get<DarReviewsResponse[]>(
        cookieStore,
        `${apis.teamsV1UrlIP}/${teamId}/dar/applications/${applicationId}/reviews`,
        {
            cache: {
                tags: [
                    CACHE_DAR,
                    CACHE_DAR_REVIEWS,
                    `${CACHE_DAR_REVIEWS}${applicationId}`,
                ],
                revalidate: 60 * 30,
            },
        }
    );
}

async function getDarReviewsUser(
    cookieStore: ReadonlyRequestCookies,
    applicationId: string,
    userId: string
): Promise<DarReviewsResponse[]> {
    return get<DarReviewsResponse[]>(
        cookieStore,
        `${apis.usersV1UrlIP}/${userId}/dar/applications/${applicationId}/reviews`,
        {
            cache: {
                tags: [
                    CACHE_DAR,
                    CACHE_DAR_REVIEWS,
                    `${CACHE_DAR_REVIEWS}${applicationId}`,
                ],
                revalidate: 60 * 30,
            },
        }
    );
}

async function updateDarApplicationTeam(
    applicationId: string,
    teamId: string,
    body: Partial<DarTeamApplication>
): Promise<Partial<DarTeamApplication>> {
    return patch<Partial<DarTeamApplication>>(
        `${apis.teamsV1UrlIP}/${teamId}/dar/applications/${applicationId}`,
        body,
        [`${CACHE_DAR_APPLICATION}${applicationId}`]
    );
}

async function updateDarApplicationUser(
    applicationId: string,
    userId: string,
    body: DarTeamApplication
): Promise<DarTeamApplication> {
    return patch<DarTeamApplication>(
        `${apis.usersV1UrlIP}/${userId}/dar/applications/${applicationId}`,
        body,
        [`${CACHE_DAR_APPLICATION}${applicationId}`]
    );
}

async function updateDarAnswers(
    applicationId: string,
    userId: string,
    body: Partial<DataAccessRequestApplication>
): Promise<Partial<DataAccessRequestApplication>> {
    return put<Partial<DataAccessRequestApplication>>(
        `${apis.usersV1UrlIP}/${userId}/dar/applications/${applicationId}`,
        body,
        [
            `${CACHE_DAR_ANSWERS}${applicationId}`,
            `${CACHE_DAR_APPLICATION}${applicationId}`,
        ]
    );
}

async function createDarApplicationReview(
    applicationId: string,
    teamId: string,
    body: Partial<DataAccessRequestApplication>
): Promise<Partial<DataAccessRequestApplication>> {
    return post<Partial<DataAccessRequestApplication>>(
        `${apis.teamsV1UrlIP}/${teamId}/dar/applications/${applicationId}/reviews`,
        body,
        [`${CACHE_DAR_REVIEWS}${applicationId}`]
    );
}

async function updateDarApplicationCommentTeam(
    applicationId: string,
    reviewId: string,
    teamId: string,
    body: Partial<DataAccessRequestApplication>
): Promise<Partial<DataAccessRequestApplication>> {
    return put<Partial<DataAccessRequestApplication>>(
        `${apis.teamsV1UrlIP}/${teamId}/dar/applications/${applicationId}/reviews/${reviewId}`,
        body,
        [`${CACHE_DAR_REVIEWS}${applicationId}`]
    );
}

async function updateDarApplicationCommentUser(
    applicationId: string,
    reviewId: string,
    userId: string,
    body: Partial<DataAccessRequestApplication>
): Promise<Partial<DataAccessRequestApplication>> {
    return put<Partial<DataAccessRequestApplication>>(
        `${apis.usersV1UrlIP}/${userId}/dar/applications/${applicationId}/reviews/${reviewId}`,
        body,
        [`${CACHE_DAR_REVIEWS}${applicationId}`]
    );
}

export {
    getApplication,
    getCohort,
    getReducedCollection,
    getDataCustodianNetworks,
    getDataset,
    getDataUse,
    getFilters,
    getKeywords,
    getFormHydration,
    getNetworkSummary,
    getTeam,
    getTeamIdFromPid,
    getTeamSummary,
    getTool,
    getUser,
    getUserFromCookie,
    getDarSections,
    getDarTeamApplication,
    getDarApplicationUser,
    getDarAnswersTeam,
    getDarAnswersUser,
    getDarReviewsTeam,
    getDarReviewsUser,
    updateDarApplicationTeam,
    updateDarAnswers,
    updateDarApplicationUser,
    createDarApplicationReview,
    updateDarApplicationCommentTeam,
    updateDarApplicationCommentUser,
};
