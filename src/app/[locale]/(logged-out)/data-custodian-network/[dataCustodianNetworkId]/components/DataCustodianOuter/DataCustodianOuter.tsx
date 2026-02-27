import Box from "@/components/Box";
import DataCustodianContent from "../DataCustodianContent";
import { NetworkCustodiansSummaryData } from "@/interfaces/DataCustodianNetwork";
import { isEmpty } from "lodash";

export default function DataCustodianOuter({
    custodiansSummaryData,
    selectedTeamIds,
}: {
    custodiansSummaryData: NetworkCustodiansSummaryData;
    selectedTeamIds: Set<string>;
}) {

    const activeCustodians = custodiansSummaryData.teams_counts.filter(
        (team) => isEmpty(selectedTeamIds) ? true : selectedTeamIds.has(team.id));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pb: 0,
            }}>
            <DataCustodianContent
                dataCustodians={activeCustodians}
                anchorIndex={1}
            />
        </Box>
    );
}
