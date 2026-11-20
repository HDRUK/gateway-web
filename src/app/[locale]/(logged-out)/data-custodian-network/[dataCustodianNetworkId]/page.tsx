import { notFound } from "next/navigation";
import { PAGE_TITLE_FALLBACKS } from "@/consts/application";
import { RouteName } from "@/consts/routeName";
import {
    getNetworkCustodiansDatasets,
    getNetworkCustodiansEntities,
    getNetworkCustodiansSummary,
    getNetworkInfo,
} from "@/utils/api";
import metaData from "@/utils/metadata";
import DataCustodianNetworkPage from "./components/DataCustodianNetworkPage/DataCustodianNetworkPage";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; dataCustodianNetworkId: string }>;
}) {
    const { locale, dataCustodianNetworkId } = await params;
    const infoData = await getNetworkInfo(dataCustodianNetworkId, {
        suppressError: true,
    });

    return metaData({
        title: infoData?.name || PAGE_TITLE_FALLBACKS.dataCustodianNetwork,
        description: infoData?.summary,
        url: `/${locale}/${RouteName.DATA_CUSTODIAN_NETWORK_ITEM}/${dataCustodianNetworkId}`,
        entity: {
            type: "dataCustodianNetwork",
            id: dataCustodianNetworkId,
        },
    });
}

export default async function Page({
    params,
}: {
    params: Promise<{ dataCustodianNetworkId: string }>;
}) {
    const { dataCustodianNetworkId } = await params;

    const infoData = await getNetworkInfo(dataCustodianNetworkId, {
        suppressError: true,
    });

    if (!infoData) notFound();

    const dataNetworkCustodiansSummary = await getNetworkCustodiansSummary(
        dataCustodianNetworkId
    );
    const dataNetworkDatasets = await getNetworkCustodiansDatasets(
        dataCustodianNetworkId
    );
    const dataNetworkCustodiansEntities = await getNetworkCustodiansEntities(
        dataCustodianNetworkId
    );

    return (
        <DataCustodianNetworkPage
            infoData={infoData}
            dataNetworkCustodiansSummary={dataNetworkCustodiansSummary}
            dataNetworkDatasets={dataNetworkDatasets}
            dataNetworkCustodiansEntities={dataNetworkCustodiansEntities}
        />
    );
}
