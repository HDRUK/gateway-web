import { styled } from "@mui/material";
import Box from "@/components/Box";

export const ActionBarWrapper = styled(Box)(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    boxShadow: "1px 1px 3px 0px #00000017",
}));
