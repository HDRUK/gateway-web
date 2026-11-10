import { styled } from "@mui/material";
import Typography from "@/components/Typography";

export const Highlight = styled(Typography)(({ theme }) => ({
    "> em": {
        backgroundColor: theme.palette.yellowCustom.main,
        fontStyle: "normal",
    },
}));

export const ResultTitle = styled("div")(() => ({
    display: "flex",
    justifyContent: "space-between",
}));
