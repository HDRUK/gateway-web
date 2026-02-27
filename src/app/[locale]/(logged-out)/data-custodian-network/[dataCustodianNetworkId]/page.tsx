import { notFound } from "next/navigation";
import { getNetworkCustodiansDatasets, getNetworkCustodiansEntities, getNetworkCustodiansSummary, getNetworkInfo } from "@/utils/api";
import metaData from "@/utils/metadata";
import { Filter } from "@/interfaces/Filter";
import { FILTER_PUBLISHER_NAME } from "@/config/forms/filters";
import DataCustodianNetwork from "./components/DataCustodianNetwork/DataCustodianNetwork";

export const metadata = metaData({
    title: "Data Custodian Network",
    description: "",
});

export default async function DataCustodianNetworkPage({
    params,
}: {
    params: Promise<{ dataCustodianNetworkId: string }>;
}) {

    const { dataCustodianNetworkId } = await params;

    const infoData = await getNetworkInfo(dataCustodianNetworkId, {
        suppressError: true,
    });

    if (!infoData) notFound();

    const dataNetworkCustodiansSummary = await getNetworkCustodiansSummary(dataCustodianNetworkId);
    const dataNetworkDatasets = await getNetworkCustodiansDatasets(dataCustodianNetworkId);
    const dataNetworkCustodiansEntities = await getNetworkCustodiansEntities(dataCustodianNetworkId);

    return (<DataCustodianNetwork 
        infoData={infoData} 
        dataNetworkCustodiansSummary={dataNetworkCustodiansSummary} 
        dataNetworkDatasets={dataNetworkDatasets} 
        dataNetworkCustodiansEntities={dataNetworkCustodiansEntities} 
    />)
}
