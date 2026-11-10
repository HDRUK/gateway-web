import { useCallback } from "react";
import { FILTER_DATA_SET_TITLES } from "@/config/forms/filters";
import { QUERY_FIELD } from "@/config/forms/search";
import { STATIC_FILTER_DATA_SOURCE } from "../constants";
import { SearchParamsPatch } from "../utils/queryParams";

export const useStaticFilterUpdate = (
    setSearchParams: (patch: SearchParamsPatch) => void
) =>
    useCallback(
        (filterName: string, value: string) => {
            setSearchParams(
                filterName === STATIC_FILTER_DATA_SOURCE
                    ? { [filterName]: value }
                    : {
                          [filterName]: value,
                          [FILTER_DATA_SET_TITLES]: undefined,
                          [QUERY_FIELD]: undefined,
                      }
            );
        },
        [setSearchParams]
    );
