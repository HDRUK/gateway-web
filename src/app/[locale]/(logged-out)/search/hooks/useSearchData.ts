import { useMemo } from "react";
import {
    Aggregations,
    PartnerPortalsResult,
    SearchAggregationData,
    SearchAggregationProviderResult,
    SearchPaginationType,
    SearchResult,
    SearchResultPartner,
} from "@/interfaces/Search";
import { HDRUK_SOURCE_VALUE, PARTNERS_SOURCE_VALUE } from "@/consts/search";

interface SourceData {
    list: SearchResult[];
    total: number;
    aggregations: Aggregations | undefined;
}

const getProviderData = (
    providerResult: SearchAggregationProviderResult | undefined
): SourceData => ({
    list: (providerResult?.hits ?? []) as SearchResult[],
    total: providerResult?.total ?? 0,
    aggregations: Array.isArray(providerResult?.aggregations)
        ? undefined
        : (providerResult?.aggregations as Aggregations | undefined),
});

const getPartnerData = (
    partners: PartnerPortalsResult | undefined
): SourceData => ({
    list: (partners?.portals ?? []).flatMap(portal =>
        portal.hits.map(
            (hit): SearchResultPartner => ({
                _id: hit.id,
                hit,
                portal: { name: portal.name, logo: portal.logo },
            })
        )
    ),
    total: partners?.total ?? 0,
    aggregations: undefined,
});

export const useSearchData = ({
    isDatasets,
    isTypesenseSearch = false,
    v1Data,
    v2Data,
    dataSource,
    perPage,
    page,
    type,
}: {
    isDatasets: boolean;
    isTypesenseSearch?: boolean;
    v1Data: SearchPaginationType<SearchResult> | undefined;
    v2Data: SearchAggregationData | undefined;
    dataSource: string;
    perPage: string;
    page: string;
    type: string;
}) => {
    return useMemo(() => {
        const useV2 = isDatasets || isTypesenseSearch;

        if (!useV2) return v1Data;
        if (v2Data === undefined) return undefined;

        const { list, total, aggregations } =
            !isTypesenseSearch && dataSource === PARTNERS_SOURCE_VALUE
                ? getPartnerData(v2Data.results[PARTNERS_SOURCE_VALUE])
                : getProviderData(v2Data.results[HDRUK_SOURCE_VALUE]);
        const perPageInt = parseInt(perPage, 10);
        const pageInt = parseInt(page, 10);

        return {
            list,
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
        isTypesenseSearch,
        v1Data,
        v2Data,
        dataSource,
        perPage,
        page,
        type,
    ]);
};
