import {
    CMSPageResponse,
    CMSPostResponse,
    PageTemplateDefault,
    PageTemplateHome,
    PageTemplatePromo,
    PageTemplateRepeat,
} from "@/interfaces/Cms";
import { MissionAndPurposesNode } from "@/interfaces/MissionAndPurposes";
import { ReleaseNode } from "@/interfaces/Releases";
import apis from "@/config/apis";
import { GetCohortDiscoveryQuery } from "@/config/queries/cohortDiscovery";
import { GetCohortTermsAndConditionsQuery } from "@/config/queries/cohortTermsAndConditions";
import { GetHomePageQuery } from "@/config/queries/homePage";
import { GetMissionAndPurposesQuery } from "@/config/queries/missionAndPurposes";
import { GetReleaseNotesQuery } from "@/config/queries/releaseNotes";
import { GetTermsAndConditionsQuery } from "@/config/queries/termsAndConditions";

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
        {
            next: { revalidate: 10 },
        }
    );
    return data.posts.edges || null;
};

const getMissionAndPurposes = async () => {
    const data: CMSPostResponse<MissionAndPurposesNode> = await fetchCMS(
        GetMissionAndPurposesQuery,
        {
            next: { revalidate: 10 },
        }
    );
    return data?.posts?.edges || null;
};

const getCohortDiscovery = async () => {
    const data: CMSPageResponse<PageTemplatePromo> = await fetchCMS(
        GetCohortDiscoveryQuery,
        {
            next: { revalidate: 10 },
        }
    );

    return data?.page || null;
};

const getHomePage = async () => {
    const data: CMSPageResponse<PageTemplateHome> = await fetchCMS(
        GetHomePageQuery,
        {
            next: { revalidate: 10 },
        }
    );

    return data?.page || null;
};

const getTermsAndConditions = async () => {
    const data: CMSPageResponse<PageTemplateDefault> = await fetchCMS(
        GetTermsAndConditionsQuery,
        {
            next: { revalidate: 10 },
        }
    );

    return data?.page || null;
};

const getCohortTermsAndConditions = async () => {
    const data: CMSPageResponse<PageTemplateRepeat> = await fetchCMS(
        GetCohortTermsAndConditionsQuery,
        {
            next: { revalidate: 10 },
        }
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
};
