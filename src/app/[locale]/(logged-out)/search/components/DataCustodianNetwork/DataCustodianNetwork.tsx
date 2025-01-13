import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { SearchResultDataCustodianCol } from "@/interfaces/Search";
import Box from "@/components/Box";
import CardStacked from "@/components/CardStacked";
import CardStackedSkeleton from "@/components/CardStacked/CardStackedSkeleton";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import usePostSwr from "@/hooks/usePostSwr";
import apis from "@/config/apis";
import { StaticImages } from "@/config/images";
import { RouteName } from "@/consts/routeName";
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
const SEARCH_PER_PAGE = 3;

const DataCustodianNetwork = ({
    searchParams = {},
}: DataCustodianNetworkProps) => {
    const t = useTranslations(TRANSLATION_PATH);

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

    const { data, mutate, isLoading } = usePostSwr<
        SearchResultDataCustodianCol[]
    >(
        `${apis.searchV1Url}/data_provider_colls?view_type=mini&perPage=${SEARCH_PER_PAGE}`,
        {
            query: searchParams.query,
            filters: dataCustodianFilters,
        }
    );

    useEffect(() => {
        mutate();
    }, [searchParams, mutate]);

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
            <ResultsList variant="tiled">
                {isLoading &&
                    [1, 2, 3].map(item => <CardStackedSkeleton key={item} />)}
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
        </Box>
    );
};

export default DataCustodianNetwork;
