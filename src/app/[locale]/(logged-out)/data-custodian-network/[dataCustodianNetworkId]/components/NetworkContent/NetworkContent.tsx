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

    const filterByActiveTeams = <T extends { team_id: string }>(items: T[]): T[] =>
        isEmpty(selectedTeamIds) ? items : items.filter(item => selectedTeamIds.has(item.team_id));

    const activeTools = filterByActiveTeams(entitiesSummaryData.tools);
    const activeDataUses = filterByActiveTeams(entitiesSummaryData.durs);
    const activePublications = filterByActiveTeams(entitiesSummaryData.publications);
    const activeCollections = filterByActiveTeams(entitiesSummaryData.collections);
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
