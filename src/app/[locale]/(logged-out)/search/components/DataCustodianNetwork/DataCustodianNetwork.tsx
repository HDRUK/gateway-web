import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import CardStacked from "@/components/CardStacked";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { StaticImages } from "@/config/images";
import { RouteName } from "@/consts/routeName";
import ResultsList from "../ResultsList";

const TRANSLATION_PATH = "pages.search";

const DataCustodianNetwork = () => {
    const t = useTranslations(TRANSLATION_PATH);

    const { data } = useGet<
        {
            id: number;
            name: string;
            img_url: string;
        }[]
    >(apis.dataCustodianNetworkV1Url);

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
                {data?.slice(0, 3)?.map(result => (
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
