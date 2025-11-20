"use server";

import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { Application } from "@/interfaces/Application";
import { AuthUser } from "@/interfaces/AuthUser";
import {
    CohortRequest,
    CohortRequestAccess,
    CohortRequestUser,
} from "@/interfaces/CohortRequest";
import { ReducedCollection } from "@/interfaces/Collection";
import {
    DarApplicationAnswer,
    DarTemplate,
    DarTemplateCountResponse,
} from "@/interfaces/DataAccessRequest";
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
import { PaginationType } from "@/interfaces/Pagination";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import { GetOptions, Cache } from "@/interfaces/Response";
import { Team } from "@/interfaces/Team";
import { TeamSummary } from "@/interfaces/TeamSummary";
import { Tool } from "@/interfaces/Tool";
import { User } from "@/interfaces/User";
import { V4Schema } from "@/interfaces/V4Schema";
import apis from "@/config/apis";
import config from "@/config/config";
import { FILTERS_PER_PAGE } from "@/config/request";
import { sessionHeader, sessionPrefix } from "@/config/session";
import {
    CACHE_DAR,
    CACHE_DAR_SECTIONS,
    CACHE_DAR_APPLICATION,
    CACHE_DAR_ANSWERS,
    CACHE_DAR_REVIEWS,
} from "@/consts/cache";
import { getUserFromToken } from "@/utils/cookies";
import { getSessionCookie } from "./getSessionCookie";
import { logger } from "./logger";
import { revalidateCache } from "./revalidateCache";

type Payload<T> = T | (() => BodyInit & T);

const { NEXT_PUBLIC_LOG_LEVEL } = process.env;

async function get<T>(
    cookieStore: ReadonlyRequestCookies,
    url: string,
    options: GetOptions = {
        suppressError: false,
        cache: undefined,
        withPagination: false,
        serveRaw: false,
    },
    headers: object = {}
): Promise<T> {
    const jwt = cookieStore.get(config.JWT_COOKIE);
    const session = await getSessionCookie();
    const { cache, suppressError, serveRaw } = options;
    const nextConfig = cache
        ? {
              next: {
                  tags: [...cache.tags, "all"],
                  revalidate: cache.revalidate || 2 * 60 * 60,
              },
          }
        : undefined;

    const res = await fetch(`${url}`, {
        headers: {
            ...headers,
            Authorization: `Bearer ${jwt?.value}`,
            [sessionHeader]: sessionPrefix + session,
        },
        ...nextConfig,
    });
    if (NEXT_PUBLIC_LOG_LEVEL === "debug") {
        logger.info(url, session, "api.get");
    }

    if (!res.ok && !suppressError) {
        let errorMessage: string;
        try {
            const errorData = await res.json();
            errorMessage = JSON.stringify(errorData, null, 2);
        } catch {
            errorMessage = await res.text();
        }
        logger.error(errorMessage, session, `api.get:${url}`);
        throw new Error("Failed to fetch data");
    }

    const json = await res.json();

    if (serveRaw) {
        return json;
    }

    if (NEXT_PUBLIC_LOG_LEVEL === "debug") {
        logger.info(json, session, "api.get.response");
    }
    if (!options.withPagination) return json.data;

    const { data, current_page, last_page, next_page_url, ...rest } = json;

    return {
        list: data,
        currentPage: current_page,
        lastPage: last_page,
        nextPageUrl: next_page_url,
        ...rest,
    };
}

async function patch<T>(
    url: string,
    payload?: Payload<T>,
    tagsToRevalidate?: string[]
): Promise<T> {
    const jwt = cookies().get(config.JWT_COOKIE);
    const session = await getSessionCookie();
    if (NEXT_PUBLIC_LOG_LEVEL === "debug") {
        const message = {
            url,
            payload: payload ?? "no payload in patch",
        };
        logger.info(message, session, "api.patch");
    }
    const res = await fetch(url, {
        method: "PATCH",

        headers: {
            Authorization: `Bearer ${jwt?.value}`,
            "Content-Type": "application/json",
            [sessionHeader]: sessionPrefix + session,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let errorMessage: string;

        try {
            const errorData = await res.json();
            errorMessage = JSON.stringify(errorData, null, 2);
        } catch {
            errorMessage = await res.text();
        }
        logger.error(errorMessage, session, `api.patch:${url}`);
        throw new Error("Failed to patch data");
    }

    if (tagsToRevalidate?.length) {
        revalidateCache(tagsToRevalidate);
    }

    const { data } = await res.json();
    if (NEXT_PUBLIC_LOG_LEVEL === "debug") {
        logger.info(data, session, "api.patch.response");
    }
    return data;
}

async function put<T>(
    url: string,
    payload: unknown,
    tagsToRevalidate?: string[]
): Promise<T> {
    const jwt = cookies().get(config.JWT_COOKIE);
    const session = await getSessionCookie();
    if (NEXT_PUBLIC_LOG_LEVEL === "debug") {
        const message = {
            url,
            payload: payload ?? "no payload in put",
        };
        logger.info(message, session, "api.put");
    }
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${jwt?.value}`,
            "Content-Type": "application/json",
            [sessionHeader]: sessionPrefix + session,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let errorMessage: string;

        try {
            const errorData = await res.json();
            errorMessage = JSON.stringify(errorData, null, 2);
        } catch {
            errorMessage = await res.text();
        }
        logger.error(errorMessage, session, `api.put:${url}`);
        throw new Error("Failed to put data");
    }

    if (tagsToRevalidate?.length) {
        revalidateCache(tagsToRevalidate);
    }

    const { data } = await res.json();
    if (NEXT_PUBLIC_LOG_LEVEL === "debug") {
        logger.info(data, session, "api.put.response");
    }
    return data;
}

async function post<T>(
    url: string,
    payload: unknown,
    tagsToRevalidate?: string[]
): Promise<T> {
    const jwt = cookies().get(config.JWT_COOKIE);
    const session = await getSessionCookie();
    if (NEXT_PUBLIC_LOG_LEVEL === "debug") {
        const message = {
            url,
            payload: payload ?? "no payload in post",
        };
        logger.info(message, session, "api.post");
    }
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt?.value}`,
            "Content-Type": "application/json",
            [sessionHeader]: sessionPrefix + session,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let errorMessage: string;

        try {
            const errorData = await res.json();
            errorMessage = JSON.stringify(errorData, null, 2);
        } catch {
            errorMessage = await res.text();
        }
        logger.error(errorMessage, session, `api.post:${url}`);
        throw new Error("Failed to post data");
    }

    if (tagsToRevalidate?.length) {
        revalidateCache(tagsToRevalidate);
    }

    const { data } = await res.json();
    if (NEXT_PUBLIC_LOG_LEVEL === "debug") {
        logger.info(data, session, "api.post.response");
    }
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
        `${apis.filtersV1UrlIP}?per_page=${FILTERS_PER_PAGE}`,
        { cache }
    );
}

async function getKeywords(
    cookieStore: ReadonlyRequestCookies
): Promise<Keyword[]> {
    const cache: Cache = {
        tags: ["keywords"],
    };
    return get<Keyword[]>(cookieStore, `${apis.keywordsV1IPUrl}?per_page=-1`, {
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

export async function getUserCohortRequest(
    cookieStore: ReadonlyRequestCookies,
    userId: string
): Promise<CohortRequestUser> {
    const cookieHeader = cookieStore
        .getAll()
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join("; ");
    const cache: Cache = {
        tags: ["cohort", "cohort-user", `cohort-user-${userId}`],
        revalidate: 15 * 60, // 15 minutes
    };
    return get<CohortRequestUser>(
        cookieStore,
        `${apis.cohortRequestsV1UrlIP}/user/${userId}`,
        { cache },
        {
            Cookie: cookieHeader,
        }
    );
}

export async function getCohortAccessRedirect(
    cookieStore: ReadonlyRequestCookies
): Promise<CohortRequestAccess> {
    const cookieHeader = cookieStore
        .getAll()
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join("; ");
    return get<CohortRequestAccess>(
        cookieStore,
        `${apis.cohortRequestsV1UrlIP}/access`,
        undefined,
        {
            Cookie: cookieHeader,
        }
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

async function getTeamInfo(
    cookieStore: ReadonlyRequestCookies,
    teamId: string,
    options?: GetOptions
): Promise<TeamSummary> {
    return await get<TeamSummary>(
        cookieStore,
        `${apis.teamsV1UrlIP}/${teamId}/info`,
        options
    );
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

async function getTeamDatasetsSummary(
    cookieStore: ReadonlyRequestCookies,
    teamId: string,
    options?: GetOptions
): Promise<TeamSummary> {
    return await get<TeamSummary>(
        cookieStore,
        `${apis.teamsV1UrlIP}/${teamId}/datasets_summary`,
        options
    );
}

async function getNetworkInfo(
    cookieStore: ReadonlyRequestCookies,
    networkId: string,
    options?: GetOptions
): Promise<NetworkSummary> {
    return await get<NetworkSummary>(
        cookieStore,
        `${apis.dataCustodianNetworkV2UrlIP}/${networkId}/info`,
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
        `${apis.dataCustodianNetworkV2UrlIP}/${networkId}/summary`,
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
    const baseUrl = `${apis.datasetsV2UrlIP}/${datasetId}`;
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

async function getTeamDataset(
    cookieStore: ReadonlyRequestCookies,
    teamId: string,
    datasetId: string,
    schemaModel?: string,
    schemaVersion?: string,
    options?: GetOptions
): Promise<Dataset> {
    const baseUrl = `${apis.teamsV2UrlIP}/${teamId}/datasets/${datasetId}`;
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
    const dataUse = await get<DataUse>(
        cookieStore,
        `${apis.dataUseV2UrlIP}/${dataUseId}`,
        options
    );

    return dataUse;
}

async function getTool(
    cookieStore: ReadonlyRequestCookies,
    toolId: string,
    options?: GetOptions
): Promise<Tool> {
    const tool = await get<Tool>(
        cookieStore,
        `${apis.toolsV2UrlIP}/${toolId}`,
        options
    );

    return tool;
}

async function getReducedTool(
    cookieStore: ReadonlyRequestCookies,
    toolId: string,
    options?: GetOptions
): Promise<Tool> {
    const collection = await get<Tool>(
        cookieStore,
        `${apis.toolsV1UrlIP}/${toolId}?view_type=mini`,
        options
    );

    return collection;
}

async function getReducedCollection(
    cookieStore: ReadonlyRequestCookies,
    collectionId: string,
    options?: GetOptions
): Promise<ReducedCollection> {
    const collection = await get<ReducedCollection>(
        cookieStore,
        `${apis.collectionsV2UrlIP}/${collectionId}?view_type=mini`,
        options
    );

    return collection;
}

async function getSchemaFromTraser(
    cookieStore: ReadonlyRequestCookies,
    schemaName: string,
    schemaVersion: string
): Promise<V4Schema> {
    return get<V4Schema>(
        cookieStore,
        `${process.env.TRASER_SERVICE_URL}/get/schema?name=${schemaName}&version=${schemaVersion}`,
        {
            cache: {
                tags: [`traser-schema-${schemaName}-${schemaVersion}`],
            },
            serveRaw: true,
        }
    );
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

async function getAllDarSections(
    cookieStore: ReadonlyRequestCookies
): Promise<QuestionBankSection[]> {
    return get<QuestionBankSection[]>(
        cookieStore,
        `${apis.dataAccessSectionV1UrlIP}?page=-1`,
        {
            cache: {
                tags: [CACHE_DAR, CACHE_DAR_SECTIONS, CACHE_DAR_REVIEWS],
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
): Promise<DarTemplateCountResponse> {
    return get<DarTemplateCountResponse>(
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

async function getDarTemplates(
    cookieStore: ReadonlyRequestCookies,
    teamId: string,
    query: string
): Promise<PaginationType<DarTemplate[]>> {
    return get<PaginationType<DarTemplate[]>>(
        cookieStore,
        `${apis.teamsV1UrlIP}/${teamId}/dar/templates${
            query ? `?${query}` : ""
        }`,
        {
            withPagination: true,
        }
    );
}

async function getDarTemplatesCount(
    cookieStore: ReadonlyRequestCookies,
    teamId: string
): Promise<DarTemplateCountResponse> {
    return get<DarTemplateCountResponse>(
        cookieStore,
        `${apis.teamsV1UrlIP}/${teamId}/dar/templates/count/published`
    );
}
export {
    getApplication,
    getCohort,
    getReducedTool,
    getReducedCollection,
    getDataCustodianNetworks,
    getDataset,
    getTeamDataset,
    getDataUse,
    getFilters,
    getKeywords,
    getFormHydration,
    getNetworkInfo,
    getNetworkSummary,
    getTeam,
    getTeamIdFromPid,
    getTeamInfo,
    getTeamSummary,
    getTeamDatasetsSummary,
    getTool,
    getUser,
    getUserFromCookie,
    getDarSections,
    getAllDarSections,
    getDarTeamApplication,
    getDarApplicationUser,
    getDarAnswersTeam,
    getDarAnswersUser,
    getDarReviewsTeam,
    getDarReviewsUser,
    getSchemaFromTraser,
    updateDarApplicationTeam,
    updateDarAnswers,
    updateDarApplicationUser,
    createDarApplicationReview,
    updateDarApplicationCommentTeam,
    updateDarApplicationCommentUser,
    getDarTemplates,
    getDarTemplatesCount,
};
