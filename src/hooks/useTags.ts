import useSWR from "swr";

import { Error, Tag } from "@/interfaces";
import { apiService } from "@/services";
import config from "@/config";

interface TagsResponse {
    tags: Tag[] | undefined;
    error: Error | undefined;
    isLoading: boolean;
}

const useTags = (): TagsResponse => {
    const { data, error } = useSWR<Tag[]>(
        config.tagsV1Url,
        apiService.getRequest
    );

    return {
        error,
        isLoading: !!data && !!error,
        tags: data,
    };
};

export default useTags;
