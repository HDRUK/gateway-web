import { ReactElement } from "react";
import Box from "@/components/Box";
import CollectionsContent from "@/components/CollectionsContent";
import DataUsesContent from "@/components/DataUsesContent";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";
import { EntitiesSummaryData } from "@/interfaces/DataCustodianNetwork";
import { isEmpty } from "lodash";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

interface NetworkContentProps {
    entitiesSummaryData: EntitiesSummaryData;
    selectedTeamIds: Set<string>;
}

const NetworkContent = ({
    entitiesSummaryData,
    selectedTeamIds,
}: NetworkContentProps) => {

    const activeTools = entitiesSummaryData.tools.filter((tool) => isEmpty(selectedTeamIds) ? true : selectedTeamIds.has(tool.team_id));
    const activeDataUses = entitiesSummaryData.durs.filter((datause) => 
        isEmpty(selectedTeamIds) ? true : selectedTeamIds.has(datause.team_id));
    const activePublications = entitiesSummaryData.publications.filter((publication) => 
        isEmpty(selectedTeamIds) ? true : selectedTeamIds.has(publication.team_id));
    const activeCollections = entitiesSummaryData.collections.filter((collection) => 
        isEmpty(selectedTeamIds) ? true : selectedTeamIds.has(collection.team_id));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}>
            <DataUsesContent
                datauses={activeDataUses}
                anchorIndex={3}
                translationPath={TRANSLATION_PATH}
            />
            <ToolsContent
                tools={activeTools}
                anchorIndex={4}
                translationPath={TRANSLATION_PATH}
            />
            <PublicationsContent
                publications={activePublications}
                anchorIndex={5}
                translationPath={TRANSLATION_PATH}
            />
            <CollectionsContent
                collections={activeCollections}
                anchorIndex={6}
                translationPath={TRANSLATION_PATH}
            />
            {/* Post-MVP: Service Offerings */}
        </Box>
    );
};

export default NetworkContent;
