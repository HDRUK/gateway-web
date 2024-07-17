/* eslint-disable default-param-last */
import {
    CMSPageResponse,
    CMSPostsResponse,
    ContentPageQueryOptions,
    PageTemplateDefault,
    PageTemplateHome,
    PageTemplatePromo,
    PageTemplateRepeat,
} from "@/interfaces/Cms";
import { MeetTheTeamNode } from "@/interfaces/MeetTheTeam";
import { MissionAndPurposesNode } from "@/interfaces/MissionAndPurposes";
import { ReleaseNode } from "@/interfaces/Releases";
import { SupportCohortDiscoveryPage } from "@/interfaces/Support";
import apis from "@/config/apis";
import { GetCohortDiscoveryQuery } from "@/config/queries/cohortDiscovery";
import { GetCohortDiscoverySupportPageQuery } from "@/config/queries/cohortDiscoverySupport";
import { GetCohortTermsAndConditionsQuery } from "@/config/queries/cohortTermsAndConditions";
import { GetContentPageQuery } from "@/config/queries/contentPage";
import { GetHomePageQuery } from "@/config/queries/homePage";
import { GetHowToSearchQuery } from "@/config/queries/howToSearch";
import { GetMeetTheTeamQuery } from "@/config/queries/meetTheTeam";
import { GetMissionAndPurposesQuery } from "@/config/queries/missionAndPurposes";
import { GetReleaseNotesQuery } from "@/config/queries/releaseNotes";
import { GetTermsAndConditionsQuery } from "@/config/queries/termsAndConditions";

const DEFAULT_OPTIONS = {
    next: { revalidate: 10 },
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

const getContentPageQuery = async (
    queryName: string,
    queryOptions: ContentPageQueryOptions
) => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery(queryName, queryOptions),
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getCohortDiscoverySupportPageQuery = async () => {
    const data: CMSPageResponse<SupportCohortDiscoveryPage> = await fetchCMS(
        GetCohortDiscoverySupportPageQuery,
        DEFAULT_OPTIONS,
        true
    );

    return data?.page || null;
};

const getCohortDiscovery = async () => {
    const data: CMSPageResponse<PageTemplatePromo> = await fetchCMS(
        GetCohortDiscoveryQuery,
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getHomePage = async () => {
    const data: PageTemplateHome = await fetchCMS(
        GetHomePageQuery,
        DEFAULT_OPTIONS
    );

    return data || null;
};

const getTermsAndConditions = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetTermsAndConditionsQuery,
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getCohortTermsAndConditions = async () => {
    const data: CMSPageResponse<PageTemplateRepeat> = await fetchCMS(
        GetCohortTermsAndConditionsQuery,
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getHowToSearchPage = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetHowToSearchQuery,
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getWorkWithUs = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getWorkWithUs", {
            id: "work-with-us",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getDevelopmentCommunity = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getDevelopmentCommunityQuery", {
            id: "development-community",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getResearchersInnovators = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getResearchersInnovatorsQuery", {
            id: "researchers-innovators",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getDataCustodians = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getDataCustodiansQuery", {
            id: "data-custodians",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getPatientsAndPublic = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getPatientsAndPublicQuery", {
            id: "patients-and-public",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getGlossary = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getGlossaryQuery", {
            id: "glossary",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getTutorials = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getTutorialsQuery", {
            id: "tutorials",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

const getGettingStarted = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetContentPageQuery("getGettingStartedQuery", {
            id: "data-custodian-getting-started",
            idType: "URI",
        }),
        DEFAULT_OPTIONS
    );

    return data?.page || null;
};

export {
    getCohortDiscovery,
    getCohortDiscoverySupportPageQuery,
    getCohortTermsAndConditions,
    getContentPageQuery,
    getHomePage,
    getHowToSearchPage,
    getMeetTheTeam,
    getMissionAndPurposes,
    getReleaseNotes,
    getTermsAndConditions,
    getWorkWithUs,
    getDevelopmentCommunity,
    getResearchersInnovators,
    getDataCustodians,
    getPatientsAndPublic,
    getGlossary,
    getTutorials,
    getGettingStarted,
};
