"use client";

import { Box } from "@mui/material";
import CohortDiscoveryButton from "../CohortDiscoveryButton";

const CtaOverride = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CohortDiscoveryButton
                color="greyCustom"
                showDatasetExplanatoryTooltip
            />
        </Box>
    );
};

export default CtaOverride;
