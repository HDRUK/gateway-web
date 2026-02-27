import Box from "@/components/Box";
import DataCustodianContent from "../DataCustodianContent";
import { NetworkCustodiansSummaryData } from "@/interfaces/DataCustodianNetwork";
import { FilterValues } from "@/interfaces/Filter";

export default function DataCustodianOuter({
    custodiansSummaryData,
    filterValues,
}: {
    custodiansSummaryData: NetworkCustodiansSummaryData;
    filterValues: FilterValues;
}) {
    console.log(filterValues);
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
                filterValues={filterValues}
            />
        </Box>
    );
}
