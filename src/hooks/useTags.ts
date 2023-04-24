import useSWR, { KeyedMutator } from "swr";

import { Tag } from "@/interfaces/Tag";
import { Error } from "@/interfaces/Error";
import { getRequest } from "@/services/api";
import config from "@/config";

interface TagsResponse {
    tags: Tag[] | undefined;
    error: Error | undefined;
    isLoading: boolean;
    mutate: KeyedMutator<string>;
}

const useTags = (): TagsResponse => {
    const { data, error, mutate } = useSWR<Tag[]>(config.tagsV1Url, getRequest);

    return {
        error,
        isLoading: !data && !error,
        tags: data,
        mutate,
    };
};

export default useTags;
