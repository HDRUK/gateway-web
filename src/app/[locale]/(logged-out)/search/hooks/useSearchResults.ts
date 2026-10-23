import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
import { useFeatures } from "@/providers/FeatureProvider";
import {
    getSearchMode,
    getV1SearchBody,
    getV1SearchUrl,
    getV2SearchBody,
    shouldFetchV1,
} from "../utils/searchRequest";
import useLoadExternalData from "./useLoadExternalData";
import { useSearchData } from "./useSearchData";

const useSearchResults = (queryParams: SearchQueryParams) => {
    const flags = useFeatures();
    const forceSearch = useSearchParams()?.get("force") !== null;
    const searchMode = getSearchMode(queryParams, flags);
    const {
        isDatasets,
        dataSource,
        isExternalSourceSelected,
        externalSearchEnabled,
        isTypesenseSearch,
    } = searchMode;

    const { data: v1Data, isLoading: isV1Searching } = usePostSwr<
        SearchPaginationType<SearchResult>
    >(getV1SearchUrl(queryParams), getV1SearchBody(queryParams), {
        keepPreviousData: true,
        withPagination: true,
        shouldFetch: shouldFetchV1(queryParams, searchMode, forceSearch),
    });

    const {
        data: v2Data,
        isValidating: isV2Searching,
        mutate: mutateAggregation,
    } = usePostSwr<SearchAggregationData>(
        apis.searchV2AggregationUrl,
        getV2SearchBody(queryParams, searchMode),
        {
            keepPreviousData: true,
            shouldFetch: externalSearchEnabled || isTypesenseSearch,
            revalidateOnMount: true,
        }
    );

    const { externalResults, isPolling: isExternalPolling } =
        useLoadExternalData(
            v2Data,
            externalSearchEnabled,
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
        externalSearchEnabled || isTypesenseSearch
            ? isV2Searching || (isExternalSourceSelected && isExternalPolling)
            : isV1Searching;

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
