import useSWR from "swr";

import { Tag } from "@/interfaces/Tag";
import { Error } from "@/interfaces/Error";
import { getRequest } from "@/services/api";
import config from "@/config";

interface TagsResponse {
    tags: Tag[] | undefined;
    error: Error | undefined;
    isLoading: boolean;
}

const useTags = (): TagsResponse => {
    const { data, error } = useSWR<Tag[]>(config.tagsV1Url, getRequest);

    return {
        error,
        isLoading: !data && !error,
        tags: data,
    };
};

export default useTags;
