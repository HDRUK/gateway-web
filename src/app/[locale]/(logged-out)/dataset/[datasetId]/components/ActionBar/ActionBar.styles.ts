import { styled } from "@mui/material";
import Box from "@/components/Box";
import theme from "@/config/theme";

export const ActionBarWrapper = styled(Box)(() => ({
    display: "grid",
    width: "100%",
    boxShadow: "1px 1px 3px 0px #00000017",

    [theme.breakpoints.up("desktop")]: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
}));
