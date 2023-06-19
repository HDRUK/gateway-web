import { GetReleaseNotesQuery } from "@/config/queries/releaseNotes";
import { ReleaseNotesResponse } from "@/interfaces/Releases";
import { postRequest } from "@/services/api/post";

const fetchFromCMS = async <T>(
    query = "",
    { variables }: Record<string, unknown> = {}
): Promise<T> => {
    return await postRequest<T>(
        process.env.WORDPRESS_API_URL || "",
        {
            query,
            variables,
        },
        { notificationOptions: { notificationsOn: false } }
    );
};

const getReleaseNotes = async () => {
    const data = await fetchFromCMS<ReleaseNotesResponse>(GetReleaseNotesQuery);
    return data?.posts?.edges || null;
};

export { fetchFromCMS, getReleaseNotes };
