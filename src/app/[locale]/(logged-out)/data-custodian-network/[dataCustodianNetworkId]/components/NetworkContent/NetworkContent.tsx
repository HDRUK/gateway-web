import { ReactElement } from "react";
import Box from "@/components/Box";
import CollectionsContent from "@/components/CollectionsContent";
import DataUsesContent from "@/components/DataUsesContent";
import DatasetsContent from "@/components/DatasetsContent";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";
import apis from "@/config/apis";
import DataCustodianContent from "../DataCustodianContent";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

interface NetworkContentProps {
    dataCustodianNetworkId: number;
}

const NetworkContent = async ({
    dataCustodianNetworkId,
}: NetworkContentProps): Promise<ReactElement> => {
    const [
        { data: custodiansSummaryData },
        { data: datasetsSummaryData },
        { data: entitiesSummaryData },
    ] = await Promise.all(
        [
            `${apis.dataCustodianNetworkV2UrlIP}/${dataCustodianNetworkId}/custodians_summary`,
            `${apis.dataCustodianNetworkV2UrlIP}/${dataCustodianNetworkId}/datasets_summary`,
            `${apis.dataCustodianNetworkV2UrlIP}/${dataCustodianNetworkId}/entities_summary`,
        ].map(async url => {
            const resp = await fetch(url);
            if (!resp.ok) {
                throw new Error("Failed to fetch network data");
            }
            return await resp.json();
        })
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}>
            <DataCustodianContent
                dataCustodians={custodiansSummaryData.teams_counts}
                anchorIndex={1}
            />
            <DatasetsContent
                datasets={datasetsSummaryData.datasets}
                anchorIndex={2}
                translationPath={TRANSLATION_PATH}
            />
            <DataUsesContent
                datauses={entitiesSummaryData.durs}
                anchorIndex={3}
                translationPath={TRANSLATION_PATH}
            />
            <ToolsContent
                tools={entitiesSummaryData.tools}
                anchorIndex={4}
                translationPath={TRANSLATION_PATH}
            />
            <PublicationsContent
                publications={entitiesSummaryData.publications}
                anchorIndex={5}
                translationPath={TRANSLATION_PATH}
            />
            <CollectionsContent
                collections={entitiesSummaryData.collections}
                anchorIndex={6}
                translationPath={TRANSLATION_PATH}
            />
            {/* Post-MVP: Service Offerings */}
        </Box>
    );
};

export default NetworkContent;
