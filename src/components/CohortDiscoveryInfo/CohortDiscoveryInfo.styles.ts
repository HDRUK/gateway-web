"use client";

import { styled } from "@mui/material";
import Box from "@/components/Box";

export const CohortDiscoveryTabContent = styled(Box)(({}) => ({
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    overflowY: "auto",
    height: "620px",
    justifySelf: "center",
    "&::-webkit-scrollbar": {
        display: "none",
    },
}));
