import { SearchCategory, SearchQueryParams } from "@/interfaces/Search";
import {
    FILTER_DATA_SUBTYPE,
    FILTER_DATA_TYPE,
    FILTER_DATE_RANGE,
    FILTER_PUBLICATION_DATE,
} from "@/config/forms/filters";
import searchFormConfig, {
    PAGE_FIELD,
    PMC_TYPE_FIELD,
    QUERY_FIELD,
    SORT_FIELD,
    TYPE_FIELD,
    VIEW_FIELD,
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

type SearchParamsReader = Pick<URLSearchParams, "get" | "entries"> | null;

type SearchParamsPatch = Record<string, string | string[] | undefined>;

const parseQueryParams = (
    searchParams: SearchParamsReader
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

const getHasSearched = (searchParams: SearchParamsReader) => {
    const allSearchParams = Object.fromEntries(searchParams?.entries() ?? []);
    const keys = Object.keys(allSearchParams).filter(
        (key: string) => allSearchParams[key] !== ""
    );

    // In the Datasets view, "view" parameter is used to switch between
    // list and table view but is not a search parameter
    return !(
        keys.length <= 2 &&
        keys.every(element => ["type", "view"].includes(element))
    );
};

const removeFilterValue = (
    filterType: keyof SearchQueryParams,
    values: string[],
    removedFilter: string
) =>
    filterType === FILTER_DATE_RANGE || filterType === FILTER_PUBLICATION_DATE
        ? values.map(value => (value === removedFilter ? "" : value))
        : values.filter(value => value !== removedFilter);

const getSearchKey = (searchParams: SearchParamsReader) => {
    const params = new URLSearchParams(
        Array.from(searchParams?.entries() ?? []).filter(
            ([key]) => key !== VIEW_FIELD
        )
    );
    params.sort();
    return params.toString();
};

const serialiseValue = (value: string | string[] | undefined) => {
    if (!Array.isArray(value)) {
        return value;
    }
    return value.some(Boolean) ? value.join("|") : undefined;
};

const buildSearchParams = (
    current: SearchParamsReader,
    patch: SearchParamsPatch,
    resetPage: boolean
) => {
    const params = new URLSearchParams(Array.from(current?.entries() ?? []));

    Object.entries(patch).forEach(([key, value]) => {
        const serialised = serialiseValue(value);

        if (serialised) {
            params.set(key, serialised);
        } else {
            params.delete(key);
        }
    });

    if (resetPage && !(PAGE_FIELD in patch)) {
        params.delete(PAGE_FIELD);
    }

    return params;
};

const getCategoryHref = (
    pathname: string,
    type: SearchCategory,
    query?: string
) =>
    `${pathname}?${new URLSearchParams({
        [TYPE_FIELD]: type,
        ...(query && { [QUERY_FIELD]: query }),
    })}`;

const getClearAllPatch = (): SearchParamsPatch =>
    Object.fromEntries(ARRAY_FILTERS.map(key => [key, undefined]));

const getRemoveFilterPatch = (
    queryParams: SearchQueryParams,
    filterType: keyof SearchQueryParams,
    removedFilter: string
): SearchParamsPatch | undefined => {
    const filterToUpdate = queryParams[filterType];

    if (!Array.isArray(filterToUpdate)) {
        return undefined;
    }

    return {
        [filterType]: removeFilterValue(
            filterType,
            filterToUpdate,
            removedFilter
        ),
        ...(filterType === FILTER_DATA_TYPE && {
            [FILTER_DATA_SUBTYPE]: undefined,
        }),
    };
};

const getFilterPatch = (
    filterValues: string[],
    filterName: string,
    secondFilterValues?: string[],
    secondFilterName?: string
): SearchParamsPatch => ({
    [filterName]: filterValues,
    ...(secondFilterName !== undefined &&
        secondFilterValues !== undefined && {
            [secondFilterName]: secondFilterValues,
        }),
});

export {
    buildSearchParams,
    getCategoryHref,
    getClearAllPatch,
    getFilterPatch,
    getHasSearched,
    getRemoveFilterPatch,
    getSearchKey,
    parseQueryParams,
};
export type { SearchParamsPatch };
