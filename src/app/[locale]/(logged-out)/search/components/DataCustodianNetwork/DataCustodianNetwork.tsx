import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { SearchResultDataCustodianCol } from "@/interfaces/Search";
import Box from "@/components/Box";
import CardStacked from "@/components/CardStacked";
import Typography from "@/components/Typography";
import usePostSwr from "@/hooks/usePostSwr";
import apis from "@/config/apis";
import { StaticImages } from "@/config/images";
import { RouteName } from "@/consts/routeName";
import ResultsList from "../ResultsList";

interface DataCustodianNetworkProps {
    searchParams: {
        query?: string;
        filters?: unknown;
    };
}

const TRANSLATION_PATH = "pages.search";
const SEARCH_PER_PAGE = 3;

const DataCustodianNetwork = ({ searchParams }: DataCustodianNetworkProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const { data, mutate } = usePostSwr<SearchResultDataCustodianCol[]>(
        `${apis.searchV1Url}/data_provider_colls?view_type=mini&perPage=${SEARCH_PER_PAGE}`,
        {
            query: searchParams.query,
            filters: searchParams.filters,
        }
    );

    useEffect(() => {
        mutate();
    }, [searchParams, mutate]);

    if (!data?.length) {
        return null;
    }

    return (
        <Box sx={{ mb: 1, p: 0 }}>
            <Typography
                fontWeight={600}
                sx={{ mt: 1, mb: 1, textDecoration: "underline" }}>
                {t("dataCustodianNetworks")}
            </Typography>
            <ResultsList variant="tiled">
                {data?.map((result: SearchResultDataCustodianCol) => (
                    <CardStacked
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