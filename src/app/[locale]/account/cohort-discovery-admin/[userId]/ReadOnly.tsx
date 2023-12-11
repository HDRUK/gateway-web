import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { formatDate } from "@/utils/date";

export default function ReadOnly({
    cohortRequest,
}: {
    cohortRequest: CohortRequest;
}) {
    return (
        <>
            {[
                {
                    label: "Date received",
                    value: formatDate(
                        new Date(cohortRequest.created_at),
                        "dd/MM/yyyy"
                    ),
                },
                {
                    label: "Date of latest action",
                    value:
                        /* only show a date if request_status is not "PENDING" */
                        cohortRequest.request_status === "PENDING"
                            ? ""
                            : formatDate(
                                  new Date(cohortRequest.updated_at),
                                  "dd/MM/yyyy"
                              ),
                },
            ].map(row => (
                <Box
                    sx={{
                        p: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 4,
                    }}>
                    <Typography>{row.label}</Typography>
                    <Typography color="GrayText">{row.value}</Typography>
                </Box>
            ))}
        </>
    );
}
