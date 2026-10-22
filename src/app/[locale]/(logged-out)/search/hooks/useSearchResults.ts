import { useMemo } from "react";
import { unstable_serialize } from "swr";
import {
    SearchAggregationData,
    SearchPaginationType,
    SearchQueryParams,
    SearchResult,
} from "@/interfaces/Search";
import useNavigationProgress from "@/hooks/useNavigationProgress";
import usePostSwr from "@/hooks/usePostSwr";
import apis from "@/config/apis";
import { ARDC_SOURCE_VALUE } from "@/consts/search";
import {
    getSearchMode,
    getV1SearchBody,
    getV1SearchUrl,
    getV2SearchBody,
    SearchFeatureFlags,
    shouldFetchV1,
} from "../utils/searchRequest";
import useLoadExternalData from "./useLoadExternalData";
import { useSearchData } from "./useSearchData";

export interface InitialSearchResults {
    key: string;
    data: unknown;
}

const useSearchResults = (
    queryParams: SearchQueryParams,
    flags: SearchFeatureFlags,
    forceSearch: boolean,
    initialResults?: InitialSearchResults,
    isPending = false
) => {
    const searchMode = getSearchMode(queryParams, flags);
    const {
        isDatasets,
        dataSource,
        isExternalSourceSelected,
        externalSearchEnabled,
        isTypesenseSearch,
    } = searchMode;

    const getInitialData = <T>(url: string, body: object) =>
        initialResults?.key === unstable_serialize([url, body])
            ? (initialResults.data as T)
            : undefined;

    const v1Url = getV1SearchUrl(queryParams);
    const v1Body = getV1SearchBody(queryParams);
    const v2Body = getV2SearchBody(queryParams, searchMode);
    const v1InitialData = getInitialData<SearchPaginationType<SearchResult>>(
        v1Url,
        v1Body
    );
    const v2InitialData = getInitialData<SearchAggregationData>(
        apis.searchV2AggregationUrl,
        v2Body
    );

    const { data: v1Data, isLoading: isV1Searching } = usePostSwr<
        SearchPaginationType<SearchResult>
    >(v1Url, v1Body, {
        keepPreviousData: !v1InitialData,
        withPagination: true,
        shouldFetch:
            !isPending && shouldFetchV1(queryParams, searchMode, forceSearch),
        fallbackData: v1InitialData,
    });

    const {
        data: v2Data,
        isValidating: isV2Searching,
        mutate: mutateAggregation,
    } = usePostSwr<SearchAggregationData>(apis.searchV2AggregationUrl, v2Body, {
        keepPreviousData: !v2InitialData,
        shouldFetch: !isPending && (externalSearchEnabled || isTypesenseSearch),
        revalidateOnMount: v2InitialData ? undefined : true,
        fallbackData: v2InitialData,
    });

    const { externalResults, isPolling: isExternalPolling } =
        useLoadExternalData(
            v2Data,
            !isPending && externalSearchEnabled,
            isV2Searching,
            mutateAggregation
        );

    const v2DataWithExternal = useMemo(() => {
        if (!v2Data || !Object.keys(externalResults).length) return v2Data;
        return {
            ...v2Data,
            results: { ...v2Data.results, ...externalResults },
        };
    }, [v2Data, externalResults]);

    const isSearching =
        isPending ||
        (externalSearchEnabled || isTypesenseSearch
            ? isV2Searching || (isExternalSourceSelected && isExternalPolling)
            : isV1Searching);

    useNavigationProgress(isSearching);

    const data = useSearchData({
        isDatasets,
        isExternalSourcesEnabled: !!flags.isExternalSourcesEnabled,
        isTypesenseSearch,
        v1Data,
        v2Data: v2DataWithExternal,
        dataSource,
        perPage: queryParams.per_page,
        page: queryParams.page,
        type: queryParams.type,
    });

    return {
        data,
        searchMode,
        isSearching,
        isExternalPolling,
        ardcResult: externalResults[ARDC_SOURCE_VALUE] ?? null,
        hdrukTotal: v2Data?.results?.HDRUK?.total,
    };
};

export default useSearchResults;
