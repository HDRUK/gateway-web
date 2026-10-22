import { SearchCategory, SearchQueryParams } from "@/interfaces/Search";
import apis from "@/config/apis";
import { PMC_TYPE_FIELD } from "@/config/forms/search";
import { FILTER_TYPE_MAPPING, HDRUK_SOURCE_VALUE } from "@/consts/search";
import { pickOnlyFilters } from "@/utils/filters";
import {
    EUROPE_PMC_SOURCE_FIELD,
    GATEWAY_SOURCE_FIELD,
    PMC_DATASET_TYPE,
    STATIC_FILTER_SOURCE,
} from "../constants";

interface SearchFeatureFlags {
    isExternalSourcesEnabled?: boolean;
    isTypesenseSearchEnabled?: boolean;
}

type SearchMode = ReturnType<typeof getSearchMode>;

const ARDC_SEARCH_URL =
    "https://researchdata.edu.au/health/search?filter-type=all-fields";

const getSearchMode = (
    queryParams: SearchQueryParams,
    { isExternalSourcesEnabled, isTypesenseSearchEnabled }: SearchFeatureFlags
) => {
    const isDatasets = queryParams.type === SearchCategory.DATASETS;
    const isPublications = queryParams.type === SearchCategory.PUBLICATIONS;
    const dataSource = queryParams.dataSource || HDRUK_SOURCE_VALUE;

    return {
        isDatasets,
        isPublications,
        dataSource,
        isExternalSourceSelected:
            !!isExternalSourcesEnabled && dataSource !== HDRUK_SOURCE_VALUE,
        externalSearchEnabled: isDatasets && !!isExternalSourcesEnabled,
        isTypesenseSearch:
            !!isTypesenseSearchEnabled &&
            !isDatasets &&
            (!isPublications || queryParams.source === GATEWAY_SOURCE_FIELD),
    };
};

const shouldFetchV1 = (
    queryParams: SearchQueryParams,
    mode: SearchMode,
    forceSearch: boolean
) =>
    !mode.externalSearchEnabled &&
    !mode.isTypesenseSearch &&
    (forceSearch ||
        !mode.isPublications ||
        queryParams.source === GATEWAY_SOURCE_FIELD ||
        (queryParams.source === EUROPE_PMC_SOURCE_FIELD &&
            !!queryParams.query));

const getV1SearchUrl = (
    queryParams: SearchQueryParams,
    baseUrl = apis.searchV1Url
) => {
    const isPublications = queryParams.type === SearchCategory.PUBLICATIONS;

    return `${baseUrl}/${queryParams.type}?${
        isPublications ? "" : "view_type=mini&"
    }per_page=${queryParams.per_page}&page=${queryParams.page}&sort=${
        queryParams.sort
    }${isPublications ? `&${STATIC_FILTER_SOURCE}=${queryParams.source}` : ""}`;
};

const getSearchFilters = (queryParams: SearchQueryParams) =>
    pickOnlyFilters(FILTER_TYPE_MAPPING[queryParams.type], queryParams);

const isEuropePmcSearch = (queryParams: SearchQueryParams) =>
    queryParams.source === EUROPE_PMC_SOURCE_FIELD;

const isEuropePmcSearchNoQuery = (queryParams: SearchQueryParams) =>
    isEuropePmcSearch(queryParams) && !queryParams.query;

const isPmcDatasetSearch = (queryParams: SearchQueryParams) =>
    isEuropePmcSearch(queryParams) &&
    queryParams[PMC_TYPE_FIELD] === PMC_DATASET_TYPE;

const getPmcDatasetNames = (queryParams: SearchQueryParams) =>
    isPmcDatasetSearch(queryParams) ? queryParams.query?.split("|") : undefined;

const getV1SearchBody = (queryParams: SearchQueryParams) => ({
    query: getPmcDatasetNames(queryParams) ?? queryParams.query,
    ...getSearchFilters(queryParams),
});

const getV2SearchBody = (queryParams: SearchQueryParams, mode: SearchMode) => ({
    query: queryParams.query || undefined,
    type: queryParams.type,
    sort: queryParams.sort,
    per_page: queryParams.per_page,
    page: queryParams.page,
    dataSource: mode.dataSource,
    ...(mode.isTypesenseSearch ? {} : { view_type: "mini" }),
    ...getSearchFilters(queryParams),
});

const getSearchRequest = (
    queryParams: SearchQueryParams,
    mode: SearchMode,
    forceSearch: boolean,
    internal = false
) => {
    if (mode.externalSearchEnabled || mode.isTypesenseSearch) {
        return {
            url: internal
                ? apis.searchV2AggregationUrlIP
                : apis.searchV2AggregationUrl,
            body: getV2SearchBody(queryParams, mode),
            withPagination: false,
        };
    }

    if (shouldFetchV1(queryParams, mode, forceSearch)) {
        return {
            url: getV1SearchUrl(
                queryParams,
                internal ? apis.searchV1UrlIP : apis.searchV1Url
            ),
            body: getV1SearchBody(queryParams),
            withPagination: true,
        };
    }

    return null;
};

const getArdcSearchUrl = (query?: string) =>
    `${ARDC_SEARCH_URL}${query ? `&q=${encodeURIComponent(query)}` : ""}`;

export {
    getArdcSearchUrl,
    getPmcDatasetNames,
    getSearchFilters,
    getSearchMode,
    getSearchRequest,
    getV1SearchBody,
    getV1SearchUrl,
    getV2SearchBody,
    isEuropePmcSearch,
    isEuropePmcSearchNoQuery,
    isPmcDatasetSearch,
    shouldFetchV1,
};
export type { SearchFeatureFlags, SearchMode };
