import {
    DatasetsSummaryData,
    NetworkDataset,
} from "@/interfaces/DataCustodianNetwork";
import Box from "@/components/Box";
import DatasetsContent from "@/components/DatasetsContent";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

export default function DatasetsOuter({
    datasets,
    associatedDatasets,
    selectedTeamIds,
}: {
    datasets: DatasetsSummaryData;
    associatedDatasets: NetworkDataset[];
    selectedTeamIds: Set<string>;
}) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pb: 0,
            }}>
            <DatasetsContent
                datasets={datasets.datasets}
                associatedDatasets={associatedDatasets}
                anchorIndex={2}
                translationPath={TRANSLATION_PATH}
                selectedTeamIds={selectedTeamIds}
            />
        </Box>
    );
}
