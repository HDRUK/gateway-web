import { ReactElement } from "react";
import { TeamSummary } from "@/interfaces/TeamSummary";
import Box from "@/components/Box";
import CollectionsContent from "@/components/CollectionsContent";
import DataUsesContent from "@/components/DataUsesContent";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";

const TRANSLATION_PATH = "pages.dataCustodian";

export default async function EntitiesOuter({
    summaryPromise,
    startIndex,
}: {
    summaryPromise: Promise<TeamSummary>;
    startIndex: number;
}): Promise<ReactElement> {
    const data = await summaryPromise;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: 0,
            }}>
            <CollectionsContent
                collections={data.collections}
                associatedCollections={data.associated_collections ?? []}
                anchorIndex={startIndex + 2}
                translationPath={TRANSLATION_PATH}
            />
            <ToolsContent
                tools={data.tools}
                associatedTools={data.associated_tools ?? []}
                anchorIndex={startIndex + 3}
                translationPath={TRANSLATION_PATH}
            />
            <DataUsesContent
                datauses={data.durs}
                associatedDatauses={data.associated_durs ?? []}
                anchorIndex={startIndex + 4}
                translationPath={TRANSLATION_PATH}
            />
            <PublicationsContent
                publications={data.publications}
                associatedPublications={data.associated_publications ?? []}
                anchorIndex={startIndex + 5}
                translationPath={TRANSLATION_PATH}
            />
        </Box>
    );
}
