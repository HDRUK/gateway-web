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
    const [{ data: summaryData }, { data: oldsummaryData }] = await Promise.all(
        [
            `${apis.dataCustodianNetworkV2UrlIP}/${dataCustodianNetworkId}/entities_summary`,
            `${apis.dataCustodianNetworkV2UrlIP}/${dataCustodianNetworkId}/custodians_summary`,
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
                dataCustodians={oldsummaryData.teams_counts}
                anchorIndex={1}
            />
            <DatasetsContent
                datasets={summaryData.datasets}
                anchorIndex={2}
                translationPath={TRANSLATION_PATH}
            />
            <DataUsesContent
                datauses={summaryData.durs}
                anchorIndex={3}
                translationPath={TRANSLATION_PATH}
            />
            <ToolsContent
                tools={summaryData.tools}
                anchorIndex={4}
                translationPath={TRANSLATION_PATH}
            />
            <PublicationsContent
                publications={summaryData.publications}
                anchorIndex={5}
                translationPath={TRANSLATION_PATH}
            />
            <CollectionsContent
                collections={summaryData.collections}
                anchorIndex={6}
                translationPath={TRANSLATION_PATH}
            />
            {/* Post-MVP: Service Offerings */}
        </Box>
    );
};

export default NetworkContent;
