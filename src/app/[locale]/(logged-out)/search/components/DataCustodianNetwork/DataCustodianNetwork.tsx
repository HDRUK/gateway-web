import { useState } from "react";
import { useTranslations } from "next-intl";
import {
    SearchAggregationData,
    SearchPaginationType,
    SearchResultDataCustodianCol,
} from "@/interfaces/Search";
import Box from "@/components/Box";
import CardStacked from "@/components/CardStacked";
import CardStackedSkeleton from "@/components/CardStacked/CardStackedSkeleton";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import usePostSwr from "@/hooks/usePostSwr";
import apis from "@/config/apis";
import { StaticImages } from "@/config/images";
import { RouteName } from "@/consts/routeName";
import { HDRUK_SOURCE_VALUE } from "@/consts/search";
import { useFeatures } from "@/providers/FeatureProvider";
import ResultsList from "../ResultsList";

interface FiltersType {
    collection: {
        datasetTitles?: string[];
        publisherName?: string[];
    };
}

interface DataCustodianNetworkFilterType {
    datacustodiannetwork: {
        datasetTitles?: string[];
        publisherNames?: string[];
    };
}

interface DataCustodianNetworkProps {
    searchParams?: {
        query?: string;
        filters?: FiltersType;
    };
}

const TRANSLATION_PATH = "pages.search";
const SEARCH_PER_PAGE = 4;

const DataCustodianNetwork = ({
    searchParams = {},
}: DataCustodianNetworkProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { isTypesenseSearchEnabled } = useFeatures();
    const [page, setPage] = useState(1);

    const generateDataCustodianFilters = ():
        | DataCustodianNetworkFilterType
        | undefined => {
        const { filters } = searchParams;
        if (filters?.collection) {
            return {
                datacustodiannetwork: {
                    datasetTitles: filters.collection.datasetTitles,
                    publisherNames: filters.collection.publisherName,
                },
            };
        }
        return undefined;
    };

    const dataCustodianFilters = generateDataCustodianFilters();

    // A new search term/filter set invalidates whatever page we were on.
    // Adjusted during render (not an effect) to avoid an extra render pass.
    const searchKey = JSON.stringify({
        query: searchParams.query,
        filters: dataCustodianFilters,
    });
    const [prevSearchKey, setPrevSearchKey] = useState(searchKey);
    if (searchKey !== prevSearchKey) {
        setPrevSearchKey(searchKey);
        setPage(1);
    }

    const { data: v1Data, isLoading: isV1Loading } = usePostSwr<
        SearchPaginationType<SearchResultDataCustodianCol>
    >(
        `${apis.searchV1Url}/data_custodian_networks?view_type=mini&per_page=${SEARCH_PER_PAGE}&page=${page}`,
        {
            query: searchParams.query,
            filters: dataCustodianFilters,
        },
        { withPagination: true, shouldFetch: !isTypesenseSearchEnabled }
    );

    const { data: v2Data, isLoading: isV2Loading } =
        usePostSwr<SearchAggregationData>(
            apis.searchV2AggregationUrl,
            {
                type: "data_custodian_networks",
                query: searchParams.query,
                page,
                per_page: SEARCH_PER_PAGE,
                sort: "name:desc",
                filters: dataCustodianFilters ?? {},
                view_type: "mini",
            },
            { shouldFetch: !!isTypesenseSearchEnabled }
        );

    const v2Result = v2Data?.results?.[HDRUK_SOURCE_VALUE];

    const data = isTypesenseSearchEnabled
        ? (v2Result?.hits as SearchResultDataCustodianCol[] | undefined)
        : v1Data?.list;
    const isLoading = isTypesenseSearchEnabled ? isV2Loading : isV1Loading;
    const total = isTypesenseSearchEnabled ? v2Result?.total : v1Data?.total;
    const lastPage = total ? Math.ceil(total / SEARCH_PER_PAGE) : 1;

    return (
        <Box sx={{ mb: 1, p: 0 }}>
            <Typography
                fontWeight={600}
                sx={{ mt: 1, mb: 1, textDecoration: "underline" }}>
                {t("dataCustodianNetworks")}
            </Typography>
            {!isLoading && !data?.length && (
                <Paper>
                    <Box sx={{ pb: 2 }}>{t("noResults")}</Box>
                </Paper>
            )}
            <ResultsList variant="tiled" fillDanglingSingleCard>
                {isLoading &&
                    Array.from({ length: SEARCH_PER_PAGE }, (_, index) => (
                        <CardStackedSkeleton key={index} />
                    ))}
                {!isLoading &&
                    data?.map(result => (
                        <CardStacked
                            key={result.id}
                            href={`${RouteName.DATA_CUSTODIAN_NETWORK_ITEM}/${result.id}`}
                            title={result.name}
                            imgUrl={
                                result?.img_url || StaticImages.BASE.placeholder
                            }
                        />
                    ))}
            </ResultsList>
            {!isLoading && lastPage > 1 && (
                <Box sx={{ p: 0, mt: 1 }}>
                    <Pagination
                        page={page}
                        count={lastPage}
                        onChange={(_, newPage) => setPage(newPage)}
                    />
                </Box>
            )}
        </Box>
    );
};

export default DataCustodianNetwork;
