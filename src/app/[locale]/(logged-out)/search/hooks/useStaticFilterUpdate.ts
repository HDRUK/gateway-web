import { Dispatch, SetStateAction, useCallback } from "react";
import { SearchQueryParams } from "@/interfaces/Search";
import { FILTER_DATA_SET_TITLES } from "@/config/forms/filters";
import { PAGE_FIELD } from "@/config/forms/search";
import { STATIC_FILTER_DATA_SOURCE } from "../constants";

interface UseStaticFilterUpdateParams {
    setQueryParams: Dispatch<SetStateAction<SearchQueryParams>>;
    updatePath: (key: string, value: string) => void;
    updatePathMultiple: (params: Record<string, string>) => void;
}

export const useStaticFilterUpdate = ({
    setQueryParams,
    updatePath,
    updatePathMultiple,
}: UseStaticFilterUpdateParams) => {
    return useCallback(
        (filterName: string, value: string) => {
            if (filterName === STATIC_FILTER_DATA_SOURCE) {
                setQueryParams(prev => ({
                    ...prev,
                    [filterName]: value,
                    [PAGE_FIELD]: "1",
                }));
                updatePathMultiple({
                    [filterName]: value,
                    [PAGE_FIELD]: "1",
                });
            } else {
                setQueryParams(prev => ({
                    ...prev,
                    [filterName]: value,
                    [FILTER_DATA_SET_TITLES]: undefined,
                    query: "",
                }));
                updatePath(filterName, value);
            }
        },
        [setQueryParams, updatePath, updatePathMultiple]
    );
};
