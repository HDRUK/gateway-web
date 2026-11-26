import { notFound } from "next/navigation";
import { EntityType } from "@/consts/application";
import {
    getNetworkCustodiansDatasets,
    getNetworkCustodiansEntities,
    getNetworkCustodiansSummary,
    getNetworkInfo,
} from "@/utils/api";
import { pageMetaData } from "@/utils/pageMetadata";
import DataCustodianNetworkPage from "./components/DataCustodianNetworkPage/DataCustodianNetworkPage";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; dataCustodianNetworkId: string }>;
}) {
    const { locale, dataCustodianNetworkId } = await params;

    return pageMetaData(
        EntityType.DATA_CUSTODIAN_NETWORK,
        dataCustodianNetworkId,
        locale
    );
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
