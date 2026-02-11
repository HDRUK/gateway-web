"use client";

import { Box } from "@mui/material";
import { CtaLink } from "@/interfaces/Cms";
import CohortDiscoveryButton from "../CohortDiscoveryButton";

const CtaOverride = ({ ctaLink }: { ctaLink: CtaLink }) => {
    return (
        <Box sx={{ display: "flex" }}>
            <CohortDiscoveryButton
                ctaLink={ctaLink}
                color="greyCustom"
                showDatasetExplanatoryTooltip
            />
        </Box>
    );
};

export default CtaOverride;
