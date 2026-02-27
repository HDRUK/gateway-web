import { ReactElement } from "react";
import Box from "@/components/Box";
import CollectionsContent from "@/components/CollectionsContent";
import DataUsesContent from "@/components/DataUsesContent";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";
import { EntitiesSummaryData } from "@/interfaces/DataCustodianNetwork";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

interface NetworkContentProps {
    entitiesSummaryData: EntitiesSummaryData;
}

const NetworkContent = async ({
    entitiesSummaryData,
}: NetworkContentProps): Promise<ReactElement> => {

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
