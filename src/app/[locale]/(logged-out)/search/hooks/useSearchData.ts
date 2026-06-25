import { useMemo } from "react";
import {
    Aggregations,
    SearchAggregationData,
    SearchPaginationType,
    SearchResult,
} from "@/interfaces/Search";
import { DataSource } from "@/consts/search";

export const useSearchData = ({
    isDatasets,
    isExternalSourcesEnabled,
    v1Data,
    v2Data,
    dataSource,
    perPage,
    page,
    type,
}: {
    isDatasets: boolean;
    isExternalSourcesEnabled: boolean;
    v1Data: SearchPaginationType<SearchResult> | undefined;
    v2Data: SearchAggregationData | undefined;
    dataSource: string;
    perPage: string;
    page: string;
    type: string;
}) => {
    return useMemo(() => {
        if (!isDatasets || !isExternalSourcesEnabled) return v1Data;
        if (v2Data === undefined) return undefined;

        const providerResult = v2Data?.results?.[dataSource as DataSource];
        const perPageInt = parseInt(perPage, 10);
        const pageInt = parseInt(page, 10);
        const total = providerResult?.total ?? 0;
        const aggregations = Array.isArray(providerResult?.aggregations)
            ? undefined
            : (providerResult?.aggregations as Aggregations | undefined);

        return {
            list: (providerResult?.hits ?? []) as SearchResult[],
            elastic_total: total,
            total,
            aggregations,
            lastPage: Math.max(1, Math.ceil(total / perPageInt)),
            from: (pageInt - 1) * perPageInt + 1,
            to: Math.min(pageInt * perPageInt, total),
            currentPage: pageInt,
            path: `search/${type}`,
        };
    }, [
        isDatasets,
        isExternalSourcesEnabled,
        v1Data,
        v2Data,
        dataSource,
        perPage,
        page,
        type,
    ]);
};
