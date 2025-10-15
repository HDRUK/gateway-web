import { styled } from "@mui/material";
import Box from "@/components/Box";

export const ActionBarWrapper = styled(Box)(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 8,
    p: 24,
    boxShadow: "3px 3px 6px 3px rgba(91, 47, 47, 0.09)",
}));
