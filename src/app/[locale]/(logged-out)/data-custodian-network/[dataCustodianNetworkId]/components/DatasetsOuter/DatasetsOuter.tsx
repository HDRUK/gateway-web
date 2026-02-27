import { ReactElement } from "react";
import Box from "@/components/Box";
import DatasetsContent from "@/components/DatasetsContent";
import { DatasetsSummaryData } from "@/interfaces/DataCustodianNetwork";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

export default function DatasetsOuter({
    datasets,
}: {
    datasets: DatasetsSummaryData;
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
                anchorIndex={2}
                translationPath={TRANSLATION_PATH}
            />
        </Box>
    );
}
