import { styled } from "@mui/material";
import Box from "@/components/Box";

export const TeamWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(2),

    [theme.breakpoints.up("tablet")]: {
        gap: theme.spacing(5),
        flexDirection: "row",
    },
}));

export const TeamImage = styled("img")(({ theme }) => ({
    height: "auto",
    width: "100%",

    [theme.breakpoints.up("tablet")]: {
        maxWidth: "30%",
    },
}));

export const TeamContent = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    gap: theme.spacing(2),

    [theme.breakpoints.up("tablet")]: {
        gap: theme.spacing(5),
    },
}));
