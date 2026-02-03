"use client";

import { Box } from "@mui/material";
import { redirect } from "next/navigation";
import { RouteName } from "@/consts/routeName";
import { useFeatures } from "@/providers/FeatureProvider";

const EXTERNAL_URL = `${process.env.NEXT_PUBLIC_COHORT_DISCOVERY_URL}/dashboard/new-query`;

const CohortDiscoveryPage = () => {
    const { isCohortDiscoveryServiceEnabled } = useFeatures();
    if (!isCohortDiscoveryServiceEnabled) redirect(RouteName.ERROR_403);

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
