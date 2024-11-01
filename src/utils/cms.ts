/* eslint-disable default-param-last */
import dayjs from "dayjs";
import {
    CMSPageResponse,
    CMSPagesResponse,
    CMSPostResponse,
    CMSPostsResponse,
    ContentPageByParentQueryOptions,
    ContentPageQueryOptions,
    PageTemplateDefault,
    PageTemplateHome,
    PageTemplatePromo,
    PageTemplateRepeat,
} from "@/interfaces/Cms";
import { ContributorsAndCollaboratorsNode } from "@/interfaces/ContributorsAndCollaborators";
import { EventNode } from "@/interfaces/Events";
import { HomepageBannerNode } from "@/interfaces/Homepage";
import { MeetTheTeamNode } from "@/interfaces/MeetTheTeam";
import { MissionAndPurposesNode } from "@/interfaces/MissionAndPurposes";
import { NewsNode } from "@/interfaces/News";
import { ReleaseNode } from "@/interfaces/Releases";
import { SupportCohortDiscoveryPage } from "@/interfaces/Support";
import apis from "@/config/apis";
import { GetCohortDiscoveryQuery } from "@/config/queries/cohortDiscovery";
import { GetCohortDiscoverySupportPageQuery } from "@/config/queries/cohortDiscoverySupport";
import { GetCohortTermsAndConditionsQuery } from "@/config/queries/cohortTermsAndConditions";
import {
    GetContentPageQuery,
    GetContentPagesByNameQuery,
} from "@/config/queries/contentPage";
import { GetContentPostQuery } from "@/config/queries/contentPost";
import { GetContributorsAndCollaboratorsQuery } from "@/config/queries/contributorsAndCollaborators";
import { GetEventsQuery } from "@/config/queries/events";
import { GetHomePageBanner, GetHomePageQuery } from "@/config/queries/homePage";
import { GetHowToSearchQuery } from "@/config/queries/howToSearch";
import { GetMeetTheTeamQuery } from "@/config/queries/meetTheTeam";
import { GetMissionAndPurposesQuery } from "@/config/queries/missionAndPurposes";
import { GetNewsQuery } from "@/config/queries/news";
import { GetReleaseNotesQuery } from "@/config/queries/releaseNotes";
import { GetTermsAndConditionsQuery } from "@/config/queries/termsAndConditions";

const DEFAULT_OPTIONS = {
    next: { revalidate: 10 },
};

const substituteEnvLinks = async <T>(content: T) => {
    if (!content) return null;

    const environments = [
        "web.preprod.hdruk.cloud",
        "web.dev.hdruk.cloud",
        "web.prod.hdruk.cloud",
        "www.healthdatagateway.org",
    ];

    const regexp = new RegExp(
        `${environments.join("|").replace(/\./g, "\\.")}`,
        "gi"
    );

    try {
        const hostname = process.env.NEXT_PUBLIC_CMS_LINK_HOSTNAME;

        if (hostname) {
            return JSON.parse(
                JSON.stringify(content).replace(regexp, hostname)
            ) as T;
        }

        console.warn("Cms link hostname env not set");

        return content;
    } catch (_) {
        return content;
    }
};

function textResponseToJson(response: string) {
    let output = "";

    response.split("").forEach((_, i) => {
        if (response.charCodeAt(i) <= 127) {
            output += response.charAt(i);
        }
    });

    output = output.replace(/\n|\r|\t/g, "");
    output = output.replace(
        /^.*(\{"data":\{"(posts|pages|page|post)":.*\[\]\}\}\}).*$/,
        "$1"
    );

    return JSON.parse(output);
}

async function fetchCMS(
    query = "",
    options: {
        next?: Record<string, unknown>;
    } = {},
    acfClean?: boolean
) {
    const headers = { "Content-Type": "application/json" };

    const res = await fetch(apis.wordPressApiUrl, {
        headers,
        method: "POST",
        body: JSON.stringify({
            query,
        }),
        ...options,
    });

    if (acfClean) {
        const response = await res.text();

        return textResponseToJson(response).data;
    }

    const response = await res.json();

    return response.data;
}

const getReleaseNotes = async () => {
    const data: CMSPostsResponse<ReleaseNode> = await fetchCMS(
        GetReleaseNotesQuery,
        DEFAULT_OPTIONS
    );
    return data.posts.edges || null;
};

const getMissionAndPurposes = async () => {
    const data: CMSPostsResponse<MissionAndPurposesNode> = await fetchCMS(
        GetMissionAndPurposesQuery,
        DEFAULT_OPTIONS
    );
    return data?.posts?.edges || null;
};

const getMeetTheTeam = async () => {
    const data: CMSPostsResponse<MeetTheTeamNode> = await fetchCMS(
        GetMeetTheTeamQuery,
        DEFAULT_OPTIONS,
        true
    );

    return data?.posts?.edges || null;
};

const getContributorsAndCollaborators = async () => {
    const data: CMSPostsResponse<ContributorsAndCollaboratorsNode> =
        await fetchCMS(
            GetContributorsAndCollaboratorsQuery,
            DEFAULT_OPTIONS,
            true
        );

    return data?.posts?.edges || null;
};

const getHomePageBanner = async () => {
    const data: CMSPostsResponse<HomepageBannerNode> = await fetchCMS(
        GetHomePageBanner,
        DEFAULT_OPTIONS,
        true
    );

    return substituteEnvLinks(data?.posts?.edges);
};

const getNews = async () => {
    const data: CMSPostsResponse<NewsNode> = await fetchCMS(
        GetNewsQuery,
        DEFAULT_OPTIONS,
        true
    );

    return substituteEnvLinks(data?.posts?.edges);
};

const getEvents = async () => {
    const data: CMSPostsResponse<EventNode> = await fetchCMS(
        GetEventsQuery,
        DEFAULT_OPTIONS,
        true
    );

    return substituteEnvLinks(data?.posts?.edges);
};

const getContentPostQuery = async (
    queryName: string,
    queryOptions: ContentPageQueryOptions
) => {
    const data: CMSPostResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPostQuery(queryName, queryOptions),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.post);
};

const getContentPageQuery = async (
    queryName: string,
    queryOptions: ContentPageQueryOptions
) => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery(queryName, queryOptions),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getContentPageByParentQuery = async (
    queryName: string,
    queryOptions: ContentPageByParentQueryOptions
) => {
    const parentData: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery(
            queryName,
            {
                ...queryOptions,
                id: queryOptions.parentId,
            },
            `
                children {
                    nodes {
                        slug
                    }
                }
        `
        ),
        DEFAULT_OPTIONS
    );

    const matchedPage = parentData?.page?.children?.nodes.find(
        ({ slug }) => slug === queryOptions.id
    );

    if (matchedPage) {
        const data: CMSPagesResponse<PageTemplateDefault> = await fetchCMS(
            GetContentPagesByNameQuery(queryName, {
                name: matchedPage.slug,
            }),
            DEFAULT_OPTIONS
        );

        return substituteEnvLinks(data?.pages.nodes[0]);
    }

    return null;
};

const getCohortDiscoverySupportPageQuery = async () => {
    const data: CMSPageResponse<SupportCohortDiscoveryPage> = await fetchCMS(
        GetCohortDiscoverySupportPageQuery,
        DEFAULT_OPTIONS,
        true
    );

    return substituteEnvLinks(data?.page);
};

const getCohortDiscovery = async () => {
    const data: CMSPageResponse<PageTemplatePromo> = await fetchCMS(
        GetCohortDiscoveryQuery,
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getHomePage = async () => {
    const data: PageTemplateHome = await fetchCMS(
        GetHomePageQuery,
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data);
};

const getTermsAndConditions = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetTermsAndConditionsQuery,
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getCohortTermsAndConditions = async () => {
    const data: CMSPageResponse<PageTemplateRepeat> = await fetchCMS(
        GetCohortTermsAndConditionsQuery,
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getHowToSearchPage = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetHowToSearchQuery,
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getWorkWithUs = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getWorkWithUs", {
            id: "work-with-us",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getTechnologyEcosystem = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getTechnologyEcosystem", {
            id: "technology-ecosystem",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getResearchersInnovators = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getResearchersInnovatorsQuery", {
            id: "researchers-innovators",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getDataCustodians = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getDataCustodiansQuery", {
            id: "data-custodians",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getPatientsAndPublic = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getPatientsAndPublicQuery", {
            id: "patients-and-public",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getGlossary = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getGlossaryQuery", {
            id: "glossary",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getGettingStarted = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getGettingStartedQuery", {
            id: "data-custodian-getting-started",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getMetadataOnboarding = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getMetadataOnboardingQuery", {
            id: "data-custodian-metadata-onboarding",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getOpenSourceDevelopment = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getOpenSourceDevelopmentQuery", {
            id: "open-source-development",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getSortedNewsEventsByDate = (data: (NewsNode | EventNode)[]) =>
    [...data].sort((a, b) => {
        return dayjs(b.node.newsFields.date).isBefore(
            dayjs(a.node.newsFields.date)
        )
            ? -1
            : 1;
    });

const hasCategoryName = (
    categories: PageTemplateDefault["categories"],
    categoryName: string
) => {
    return !!categories?.nodes?.find(item => item.name === categoryName);
};

const getPrivacyPolicy = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getPrivacyPolicyQuery", {
            id: "privacy-policy",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

const getCookieNotice = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getCookieNoticeQuery", {
            id: "cookie-notice",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return substituteEnvLinks(data?.page);
};

export {
    getCohortDiscovery,
    getCohortDiscoverySupportPageQuery,
    getCohortTermsAndConditions,
    getContentPageByParentQuery,
    getContentPageQuery,
    getContentPostQuery,
    getCookieNotice,
    getDataCustodians,
    getTechnologyEcosystem,
    getEvents,
    getGettingStarted,
    getGlossary,
    getHomePage,
    getHomePageBanner,
    getHowToSearchPage,
    getMeetTheTeam,
    getMetadataOnboarding,
    getMissionAndPurposes,
    getNews,
    getOpenSourceDevelopment,
    getPatientsAndPublic,
    getPrivacyPolicy,
    getReleaseNotes,
    getResearchersInnovators,
    getSortedNewsEventsByDate,
    getTermsAndConditions,
    getWorkWithUs,
    hasCategoryName,
    substituteEnvLinks,
    getContributorsAndCollaborators,
};
