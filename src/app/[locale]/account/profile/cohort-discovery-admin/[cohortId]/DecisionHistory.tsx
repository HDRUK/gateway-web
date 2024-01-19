import { CohortRequest } from "@/interfaces/CohortRequest";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import Scrollbar from "@/components/Scrollbar";
import Typography from "@/components/Typography";
import { formatDate } from "@/utils/date";

interface DecisionHistoryProps {
    cohortRequest: CohortRequest;
}

export default function DecisionHistory({
    cohortRequest,
}: DecisionHistoryProps) {
    return (
        <Accordion
            heading={<Typography>Show decision history</Typography>}
            contents={
                <Scrollbar height="400px">
                    {cohortRequest.logs.map(log => (
                        <Box
                            key={log.id}
                            sx={{
                                p: 0,
                                m: 0,
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 2,
                            }}>
                            <Typography sx={{ width: "25%" }} color="GrayText">
                                {log.request_status}
                            </Typography>
                            <Typography sx={{ width: "25%" }} color="GrayText">
                                {formatDate(log.updated_at, "DD/MM/YYYY")}
                            </Typography>
                            <Typography sx={{ width: "50%" }} color="GrayText">
                                {log.details}
                            </Typography>
                        </Box>
                    ))}
                </Scrollbar>
            }
        />
    );
}
