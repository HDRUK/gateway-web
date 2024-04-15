import { styled } from "@mui/material";
import Box from "@/components/Box";

export const ActionBar = styled(Box)(({ theme }) => ({
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
    padding: "1em",
    width: "100%",
    maxWidth: 1440,
    textAlign: "left",

    [theme.breakpoints.down("tablet")]: {
        flexDirection: "column",
    },
}));
