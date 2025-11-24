import { ReactElement } from "react";
import Box from "@/components/Box";
import CollectionsContent from "@/components/CollectionsContent";
import DataUsesContent from "@/components/DataUsesContent";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";
import apis from "@/config/apis";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

interface NetworkContentProps {
    dataCustodianNetworkId: number;
}

const NetworkContent = async ({
    dataCustodianNetworkId,
}: NetworkContentProps): Promise<ReactElement> => {
    const resp = await fetch(
        `${apis.dataCustodianNetworkV2UrlIP}/${dataCustodianNetworkId}/entities_summary`,
        {
            next: {
                revalidate: 180,
                tags: ["all", `entities_summary-${dataCustodianNetworkId}`],
            },
            cache: "force-cache",
        }
    );
    if (!resp.ok) {
        throw new Error("Failed to fetch network data");
    }
    const { data: entitiesSummaryData } = await resp.json();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}>
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
