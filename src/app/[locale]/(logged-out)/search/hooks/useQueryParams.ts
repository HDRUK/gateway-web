import {
    startTransition,
    useCallback,
    useState,
} from "react";
import { FieldValues } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    SearchCategory,
    SearchQueryParams,
} from "@/interfaces/Search";
import * as Filters from "@/config/forms/filters";
import searchFormConfig, {
    PAGE_FIELD,
    PMC_TYPE_FIELD,
    QUERY_FIELD,
    SORT_FIELD,
    TYPE_FIELD,
} from "@/config/forms/search";
import { HDRUK_SOURCE_VALUE } from "@/consts/search";
import {
    STATIC_FILTER_DATA_SOURCE,
    STATIC_FILTER_SOURCE,
} from "../constants";

export const useQueryParams = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getParamString = useCallback(
        (paramName: string) => searchParams?.get(paramName)?.toString(),
        [searchParams]
    );

    const getParamArray = useCallback(
        (paramName: string, allowEmptyStrings?: boolean) => {
            const param = searchParams?.get(paramName)?.split("|");
            return allowEmptyStrings ? param : param?.filter(Boolean);
        },
        [searchParams]
    );

    const [queryParams, setQueryParams] = useState<SearchQueryParams>(() => {
        const str = (key: string) => searchParams?.get(key)?.toString();
        const arr = (key: string, allowEmpty = false) => {
            const v = searchParams?.get(key)?.split("|");
            return allowEmpty ? v : v?.filter(Boolean);
        };

        return {
            query: str(QUERY_FIELD) || searchFormConfig.defaultValues.query,
            sort: str(SORT_FIELD) || searchFormConfig.defaultValues.sort,
            page: str(PAGE_FIELD) || "1",
            per_page: "25",
            type: (str(TYPE_FIELD) as SearchCategory) || SearchCategory.DATASETS,
            [STATIC_FILTER_SOURCE]:
                str(STATIC_FILTER_SOURCE) || searchFormConfig.defaultValues.source,
            [STATIC_FILTER_DATA_SOURCE]:
                str(STATIC_FILTER_DATA_SOURCE) || HDRUK_SOURCE_VALUE,
            [PMC_TYPE_FIELD]: str(PMC_TYPE_FIELD),
            [Filters.FILTER_DATA_USE_TITLES]: arr(Filters.FILTER_DATA_USE_TITLES),
            [Filters.FILTER_PUBLISHER_NAME]: arr(Filters.FILTER_PUBLISHER_NAME),
            [Filters.FILTER_COLLECTION_NAME]: arr(Filters.FILTER_COLLECTION_NAME),
            [Filters.FILTER_COLLECTION_NAMES]: arr(Filters.FILTER_COLLECTION_NAMES),
            [Filters.FILTER_GEOGRAPHIC_LOCATION]: arr(Filters.FILTER_GEOGRAPHIC_LOCATION),
            [Filters.FILTER_DATE_RANGE]: arr(Filters.FILTER_DATE_RANGE, true),
            [Filters.FILTER_ORGANISATION_NAME]: arr(Filters.FILTER_ORGANISATION_NAME),
            [Filters.FILTER_DATA_SET_TITLES]: arr(Filters.FILTER_DATA_SET_TITLES),
            [Filters.FILTER_DATA_TYPE]: arr(Filters.FILTER_DATA_TYPE),
            [Filters.FILTER_DATA_SUBTYPE]: arr(Filters.FILTER_DATA_SUBTYPE),
            [Filters.FILTER_PUBLICATION_DATE]: arr(Filters.FILTER_PUBLICATION_DATE, true),
            [Filters.FILTER_PUBLICATION_TYPE]: arr(Filters.FILTER_PUBLICATION_TYPE),
            [Filters.FILTER_SECTOR]: arr(Filters.FILTER_SECTOR),
            [Filters.FILTER_DATA_PROVIDER]: arr(Filters.FILTER_DATA_PROVIDER),
            [Filters.FILTER_DATA_CUSTODIAN_NETWORK]: arr(Filters.FILTER_DATA_CUSTODIAN_NETWORK),
            [Filters.FILTER_ACCESS_SERVICE]: arr(Filters.FILTER_ACCESS_SERVICE),
            [Filters.FILTER_POPULATION_SIZE]: arr(Filters.FILTER_POPULATION_SIZE),
            [Filters.FILTER_PROGRAMMING_LANGUAGE]: arr(Filters.FILTER_PROGRAMMING_LANGUAGE),
            [Filters.FILTER_TYPE_CATEGORY]: arr(Filters.FILTER_TYPE_CATEGORY),
            [Filters.FILTER_CONTAINS_BIOSAMPLES]: arr(Filters.FILTER_CONTAINS_BIOSAMPLES),
            [Filters.FILTER_MATERIAL_TYPE]: arr(Filters.FILTER_MATERIAL_TYPE),
            [Filters.FILTER_FORMAT_STANDARDS]: arr(Filters.FILTER_FORMAT_STANDARDS),
            [Filters.FILTER_COHORT_DISCOVERY]: arr(Filters.FILTER_COHORT_DISCOVERY),
        };
    });

    const updatePath = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set(key, value);
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                });
            });
        },
        [pathname, router, searchParams]
    );

    const updatePathMultiple = useCallback(
        (params: Record<string, string>) => {
            const current = new URLSearchParams(searchParams?.toString());
            Object.entries(params).forEach(([key, value]) => {
                if (value === undefined) {
                    current.delete(key);
                } else {
                    current.set(key, value);
                }
            });
            router.push(`${pathname}?${current.toString()}`, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    const removeArrayQueryAndPush = useCallback(
        (paramKey: string, paramValue: string) => {
            const params = new URLSearchParams(searchParams?.toString());
            const filtered = [...params].filter(
                ([key, value]) => !(key === paramKey && value === paramValue)
            );
            router.push(`?${new URLSearchParams(filtered).toString()}`, {
                scroll: false,
            });
        },
        [router, searchParams]
    );

    const onQuerySubmit = useCallback(
        (data: FieldValues) => {
            setQueryParams(prev => ({ ...prev, ...data, [PAGE_FIELD]: "1" }));
            updatePathMultiple({
                [QUERY_FIELD]: data.query,
                [PAGE_FIELD]: "1",
            });
        },
        [updatePathMultiple]
    );

    const onSortChange = useCallback(
        (selectedValue: string) => {
            setQueryParams(prev => {
                if (selectedValue === prev.sort) return prev;
                updatePath(SORT_FIELD, selectedValue);
                return { ...prev, sort: selectedValue };
            });
        },
        [updatePath]
    );

    const resetQueryParamState = useCallback(
        (selectedType: SearchCategory) => {
            setQueryParams(prev => ({
                query: prev.query,
                sort: searchFormConfig.defaultValues.sort,
                page: "1",
                per_page: "25",
                type: selectedType,
                [Filters.FILTER_DATA_USE_TITLES]: undefined,
                [Filters.FILTER_PUBLISHER_NAME]: undefined,
                [Filters.FILTER_COLLECTION_NAME]: undefined,
                [Filters.FILTER_COLLECTION_NAMES]: undefined,
                [Filters.FILTER_GEOGRAPHIC_LOCATION]: undefined,
                [Filters.FILTER_DATE_RANGE]: undefined,
                [Filters.FILTER_ORGANISATION_NAME]: undefined,
                [Filters.FILTER_DATA_SET_TITLES]: undefined,
                [Filters.FILTER_DATA_TYPE]: undefined,
                [Filters.FILTER_DATA_SUBTYPE]: undefined,
                [Filters.FILTER_PUBLICATION_DATE]: undefined,
                [Filters.FILTER_PUBLICATION_TYPE]: undefined,
                [Filters.FILTER_SECTOR]: undefined,
                [Filters.FILTER_DATA_PROVIDER]: undefined,
                [Filters.FILTER_DATA_CUSTODIAN_NETWORK]: undefined,
                [Filters.FILTER_ACCESS_SERVICE]: undefined,
                [Filters.FILTER_POPULATION_SIZE]: undefined,
                [Filters.FILTER_PROGRAMMING_LANGUAGE]: undefined,
                [Filters.FILTER_TYPE_CATEGORY]: undefined,
                [Filters.FILTER_CONTAINS_BIOSAMPLES]: undefined,
                [Filters.FILTER_MATERIAL_TYPE]: undefined,
                [STATIC_FILTER_SOURCE]: searchFormConfig.defaultValues.source,
                [STATIC_FILTER_DATA_SOURCE]: HDRUK_SOURCE_VALUE,
                [PMC_TYPE_FIELD]: undefined,
                [Filters.FILTER_FORMAT_STANDARDS]: undefined,
                [Filters.FILTER_COHORT_DISCOVERY]: undefined,
            }));
        },
        []
    );

    return {
        queryParams,
        setQueryParams,
        pathname,
        searchParams,
        getParamString,
        getParamArray,
        updatePath,
        updatePathMultiple,
        removeArrayQueryAndPush,
        onQuerySubmit,
        onSortChange,
        resetQueryParamState,
    };
};
