"use client";

import { styled } from "@mui/material";
import Box from "@/components/Box";

export const CohortDiscoveryTabContent = styled(Box)(({ theme }) => ({
    // bgcolor: "white",
    // p: 3,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    overflowY: "auto",
    height: "520px",
    justifySelf: "center",
    "&::-webkit-scrollbar": {
        display: "none",
    },
}));
