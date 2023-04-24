import useSWR, { KeyedMutator } from "swr";

import { Filter } from "@/interfaces/Filter";
import { Error } from "@/interfaces/Error";
import { getRequest } from "@/services/api";
import config from "@/config";

interface FiltersResponse {
    filters: Filter[] | undefined;
    error: Error | undefined;
    isLoading: boolean;
    mutate: KeyedMutator<string>;
}

const useFilters = (): FiltersResponse => {
    const { data, error, mutate } = useSWR<Filter[]>(
        config.filtersV1Url,
        getRequest
    );

    return {
        error,
        isLoading: !data && !error,
        filters: data,
        mutate,
    };
};

export default useFilters;
