import Box from "@/components/Box";
import Chip from "@/components/Chip";
import Typography from "@/components/Typography";
import { statusMapping } from "@/consts/cohortDiscovery";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { capitalise } from "@/utils/general";

export default function Header({
    cohortRequest,
}: {
    cohortRequest: CohortRequest;
}) {
    return (
        <Box
            sx={{
                p: 0,
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
            }}>
            <Typography variant="h2">
                {cohortRequest.user.name}
                <Typography
                    sx={{ ml: 1, color: "GrayText", fontSize: 18 }}
                    variant="body1"
                    component="span">
                    {cohortRequest.user.email}
                </Typography>
            </Typography>
            <Chip
                size="small"
                label={capitalise(cohortRequest.request_status)}
                color={statusMapping[cohortRequest.request_status]}
            />
        </Box>
    );
}
