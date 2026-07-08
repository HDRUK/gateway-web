import { ReactElement } from "react";
import { TeamSummary } from "@/interfaces/TeamSummary";
import Box from "@/components/Box";
import DatasetsContent from "@/components/DatasetsContent";
import { getTeamDatasetsSummary } from "@/utils/api";

const TRANSLATION_PATH = "pages.dataCustodian";

export default async function DatasetsOuter({
    dataCustodianId,
    summaryPromise,
    startIndex,
}: {
    dataCustodianId: string;
    summaryPromise: Promise<TeamSummary>;
    startIndex: number;
}): Promise<ReactElement> {
    const [data, summary] = await Promise.all([
        getTeamDatasetsSummary(dataCustodianId, {
            cache: {
                tags: [`custodian_datasets_summary-${dataCustodianId}`],
                revalidate: 180,
            },
        }),
        summaryPromise,
    ]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pb: 0,
            }}>
            <DatasetsContent
                datasets={data.datasets}
                associatedDatasets={summary.associated_datasets ?? []}
                anchorIndex={startIndex + 1}
                translationPath={TRANSLATION_PATH}
            />
        </Box>
    );
}
