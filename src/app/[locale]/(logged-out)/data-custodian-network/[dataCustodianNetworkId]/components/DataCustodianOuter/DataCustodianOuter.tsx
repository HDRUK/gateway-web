import { ReactElement } from "react";
import Box from "@/components/Box";
import DataCustodianContent from "../DataCustodianContent";
import { NetworkCustodiansSummaryData } from "@/interfaces/DataCustodianNetwork";

export default function DataCustodianOuter({
    custodiansSummaryData,
}: {
    custodiansSummaryData: NetworkCustodiansSummaryData;
}) {

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
