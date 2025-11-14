import { ReactElement } from "react";
import Box from "@/components/Box";
import DatasetsContent from "@/components/DatasetsContent";
import apis from "@/config/apis";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

export default async function DatasetsOuter({
    dataCustodianNetworkId,
}: {
    dataCustodianNetworkId: number;
}): Promise<ReactElement> {
    const resp = await fetch(
        `${apis.dataCustodianNetworkV2UrlIP}/${dataCustodianNetworkId}/datasets_summary`,
        {
            next: {
                revalidate: 180,
                tags: ["all", `datasets_summary-${dataCustodianNetworkId}`],
            },
            cache: "force-cache",
        }
    );
    if (!resp.ok) {
        throw new Error("Failed to fetch network data");
    }
    const { data: datasetsSummaryData } = await resp.json();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pb: 0,
            }}>
            <DatasetsContent
                datasets={datasetsSummaryData.datasets}
                anchorIndex={2}
                translationPath={TRANSLATION_PATH}
            />
        </Box>
    );
}
