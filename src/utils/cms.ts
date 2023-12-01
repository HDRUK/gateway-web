import { GetReleaseNotesQuery } from "@/config/queries/releaseNotes";
import { GetMissionAndPurposesQuery } from "@/config/queries/missionAndPurposes";
import { ReleaseNode } from "@/interfaces/Releases";
import { MissionAndPurposesNode } from "@/interfaces/MissionAndPurposes";
import apis from "@/config/apis";
import { CMSResponse } from "@/interfaces/Cms";

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
    const data: CMSResponse<ReleaseNode> = await fetchCMS(
        GetReleaseNotesQuery,
        {
            next: { revalidate: 10 },
        }
    );
    return data.posts.edges || null;
};

const getMissionAndPurposes = async () => {
    const data: CMSResponse<MissionAndPurposesNode> = await fetchCMS(
        GetMissionAndPurposesQuery,
        {
            next: { revalidate: 10 },
        }
    );
    return data?.posts?.edges || null;
};

export { getReleaseNotes, getMissionAndPurposes };
