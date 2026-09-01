import { Typography, styled } from "@mui/material";
import Box from "@/components/Box";

export const ActionBar = styled(Box)(({ theme }) => ({
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
    padding: "1em",
    width: "100%",
    textAlign: "left",

    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
    },
}));

export const ResultLimitText = styled(Typography)(() => ({
    fontWeight: 500,
}));

export const toggleViewButton = {
    "& .MuiButton-startIcon": { color: "success.main" },
    "&:hover .MuiButton-startIcon, &:focus-visible .MuiButton-startIcon": {
        color: "inherit",
    },
};
