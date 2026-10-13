import { useCallback, useState } from "react";
import { FieldValues } from "react-hook-form";
import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { SearchCategory, SearchQueryParams } from "@/interfaces/Search";
import searchFormConfig, {
    PAGE_FIELD,
    PMC_TYPE_FIELD,
    QUERY_FIELD,
    SORT_FIELD,
    TYPE_FIELD,
} from "@/config/forms/search";
import { HDRUK_SOURCE_VALUE } from "@/consts/search";
import {
    ALLOW_EMPTY_FILTERS,
    ARRAY_FILTERS,
    SEARCH_PER_PAGE,
    STATIC_FILTER_DATA_SOURCE,
    STATIC_FILTER_SOURCE,
} from "../constants";

type ArrayFilters = Pick<SearchQueryParams, (typeof ARRAY_FILTERS)[number]>;

const parseQueryParams = (
    searchParams: ReadonlyURLSearchParams | null
): SearchQueryParams => {
    const str = (key: string) => searchParams?.get(key)?.toString();

    return {
        query: str(QUERY_FIELD) || searchFormConfig.defaultValues.query,
        sort: str(SORT_FIELD) || searchFormConfig.defaultValues.sort,
        page: str(PAGE_FIELD) || "1",
        per_page: SEARCH_PER_PAGE,
        type: (str(TYPE_FIELD) as SearchCategory) || SearchCategory.DATASETS,
        [STATIC_FILTER_SOURCE]:
            str(STATIC_FILTER_SOURCE) || searchFormConfig.defaultValues.source,
        [STATIC_FILTER_DATA_SOURCE]:
            str(STATIC_FILTER_DATA_SOURCE) || HDRUK_SOURCE_VALUE,
        [PMC_TYPE_FIELD]: str(PMC_TYPE_FIELD),
        ...(Object.fromEntries(
            ARRAY_FILTERS.map(key => {
                const values = searchParams?.get(key)?.split("|");
                return [
                    key,
                    ALLOW_EMPTY_FILTERS.includes(key)
                        ? values
                        : values?.filter(Boolean),
                ];
            })
        ) as ArrayFilters),
    };
};

export const useQueryParams = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getParamString = useCallback(
        (paramName: string) => searchParams?.get(paramName)?.toString(),
        [searchParams]
    );

    const [queryParams, setQueryParams] = useState<SearchQueryParams>(() =>
        parseQueryParams(searchParams)
    );

    const urlType =
        (searchParams?.get(TYPE_FIELD) as SearchCategory) ||
        SearchCategory.DATASETS;
    const [prevUrlType, setPrevUrlType] = useState(urlType);

    if (urlType !== prevUrlType) {
        setPrevUrlType(urlType);
        if (urlType !== queryParams.type) {
            setQueryParams(parseQueryParams(searchParams));
        }
    }

    const updatePath = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set(key, value);
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    const updatePathMultiple = useCallback(
        (params: Record<string, string | undefined>) => {
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
            if (selectedValue === queryParams.sort) {
                return;
            }
            setQueryParams(prev => ({ ...prev, sort: selectedValue }));
            updatePath(SORT_FIELD, selectedValue);
        },
        [queryParams.sort, updatePath]
    );

    const resetQueryParamState = useCallback((selectedType: SearchCategory) => {
        setQueryParams(prev => ({
            ...parseQueryParams(null),
            query: prev.query,
            type: selectedType,
        }));
    }, []);

    return {
        queryParams,
        setQueryParams,
        pathname,
        searchParams,
        getParamString,
        updatePath,
        updatePathMultiple,
        removeArrayQueryAndPush,
        onQuerySubmit,
        onSortChange,
        resetQueryParamState,
    };
};
