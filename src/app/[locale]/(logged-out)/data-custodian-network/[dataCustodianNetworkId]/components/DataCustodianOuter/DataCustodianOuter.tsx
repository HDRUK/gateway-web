import { ReactElement } from "react";
import Box from "@/components/Box";
import apis from "@/config/apis";
import DataCustodianContent from "../DataCustodianContent";

export default async function DataCustodianOuter({
    dataCustodianNetworkId,
}: {
    dataCustodianNetworkId: number;
}): Promise<ReactElement> {
    const resp = await fetch(
        `${apis.dataCustodianNetworkV2UrlIP}/${dataCustodianNetworkId}/custodians_summary`,
        {
            next: {
                revalidate: 180,
                tags: ["all", `custodians_summary-${dataCustodianNetworkId}`],
            },
            cache: "force-cache",
        }
    );
    if (!resp.ok) {
        throw new Error("Failed to fetch network data");
    }
    const { data: custodiansSummaryData } = await resp.json();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pb: 0,
            }}>
            <DataCustodianContent
                dataCustodians={custodiansSummaryData.teams_counts}
                anchorIndex={1}
            />
        </Box>
    );
}
