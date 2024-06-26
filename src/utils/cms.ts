import {
    CMSPageResponse,
    CMSPostResponse,
    PageTemplateDefault,
    PageTemplateHome,
    PageTemplatePromo,
    PageTemplateRepeat,
} from "@/interfaces/Cms";
import { MeetTheTeamNode } from "@/interfaces/MeetTheTeam";
import { MissionAndPurposesNode } from "@/interfaces/MissionAndPurposes";
import { ReleaseNode } from "@/interfaces/Releases";
import apis from "@/config/apis";
import { GetCohortDiscoveryQuery } from "@/config/queries/cohortDiscovery";
import { GetCohortTermsAndConditionsQuery } from "@/config/queries/cohortTermsAndConditions";
import { GetHomePageQuery } from "@/config/queries/homePage";
import { GetHowToSearchQuery } from "@/config/queries/howToSearch";
import { GetMeetTheTeamQuery } from "@/config/queries/meetTheTeam";
import { GetMissionAndPurposesQuery } from "@/config/queries/missionAndPurposes";
import { GetReleaseNotesQuery } from "@/config/queries/releaseNotes";
import { GetTermsAndConditionsQuery } from "@/config/queries/termsAndConditions";

const DEFAULT_OPTIONS = {
    next: { revalidate: 10 },
};

async function fetchCMS(
    query = "",
    options: {
        next?: Record<string, unknown>;
    } = {}
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

    const json = await res.json();

    if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch API");
    }
    return json.data;
}

const getReleaseNotes = async () => {
    const data: CMSPostResponse<ReleaseNode> = await fetchCMS(
        GetReleaseNotesQuery,
        DEFAULT_OPTIONS
    );
    return data.posts.edges || null;
};

const getMissionAndPurposes = async () => {
    const data: CMSPostResponse<MissionAndPurposesNode> = await fetchCMS(
        GetMissionAndPurposesQuery,
        DEFAULT_OPTIONS
    );
    return data?.posts?.edges || null;
};

const getMeetTheTeam = async () => {
    const data: CMSPostResponse<MeetTheTeamNode> = await fetchCMS(
        GetMeetTheTeamQuery,
        DEFAULT_OPTIONS
    );

    return data?.posts?.edges || null;
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

export {
    getCohortTermsAndConditions,
    getReleaseNotes,
    getMissionAndPurposes,
    getCohortDiscovery,
    getTermsAndConditions,
    getHomePage,
    getHowToSearchPage,
    getMeetTheTeam,
};
