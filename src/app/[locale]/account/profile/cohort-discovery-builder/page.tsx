import { Box } from "@mui/material";

const EXTERNAL_URL = `${process.env.NEXT_PUBLIC_COHORT_DISCOVERY_URL}/dashboard/new-query`;

const CohortDiscoveryPage = async () => {
    return (
        <Box
            component="iframe"
            src={EXTERNAL_URL}
            title="Cohort discovery"
            sx={{
                border: 0,
                width: "100%",
                flex: 1,
                height: "calc(100vh - 200px)",
            }}
        />
    );
};

export default CohortDiscoveryPage;
