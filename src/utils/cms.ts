import apis from "@/config/apis";
import { GetReleaseNotesQuery } from "@/config/queries/releaseNotes";
import { GetMissionAndPurposesQuery } from "@/config/queries/missionAndPurposes";
import { ReleaseNotesResponse } from "@/interfaces/Releases";
import { postRequest } from "@/services/api/post";
import { MissionAndPurposesResponse } from "@/interfaces/MissionAndPurposes";

const fetchFromCMS = async <T>(
    query = "",
    { variables }: Record<string, unknown> = {}
): Promise<T> => {
    return await postRequest<T>(
        apis.wordPressApiUrl || "",
        {
            query,
            variables,
        },
        {
            notificationOptions: {
                successNotificationsOn: false,
                errorNotificationsOn: false,
            },
        }
    );
};

const getReleaseNotes = async () => {
    const data = await fetchFromCMS<ReleaseNotesResponse>(GetReleaseNotesQuery);
    return data?.posts?.edges || null;
};

const getMissionAndPurposes = async () => {
    const data = await fetchFromCMS<MissionAndPurposesResponse>(
        GetMissionAndPurposesQuery
    );
    return data?.posts?.edges || null;
};

export { fetchFromCMS, getReleaseNotes, getMissionAndPurposes };
