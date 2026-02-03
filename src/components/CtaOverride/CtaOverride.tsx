"use client";

import { Box } from "@mui/material";
import { CtaLink } from "@/interfaces/Cms";
import CohortDiscoveryRQuestButton from "../CohortDiscoveryButton/CohortDiscoveryRQuest";

const CtaOverride = ({ ctaLink }: { ctaLink: CtaLink }) => {
    return (
        <Box sx={{ display: "flex" }}>
            <CohortDiscoveryRQuestButton
                ctaLink={ctaLink}
                color="greyCustom"
                sx={{ mt: 3 }}
            />
        </Box>
    );
};

export default CtaOverride;
