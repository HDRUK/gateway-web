import { Box } from "@mui/material";
import { IntegrationHistory } from "@/interfaces/IntegrationHistory";
import IntegrationHistoryTable from "../components/IntegrationHistoryTable";

export default function IntegrationHistoryPage() {
    const integrationHistory: Array<IntegrationHistory> = [
        {
            run_time: "12 March 2025 14:00",
            success: false,
            message: "An error occured",
        },
        {
            run_time: "11 March 2025 14:00",
            success: true,
        },
        {
            run_time: "10 March 2025 14:00",
            success: true,
        },
    ];

    return (
        <Box sx={{ width: "100%" }}>
            <IntegrationHistoryTable integrations={integrationHistory} />
        </Box>
    );
}
