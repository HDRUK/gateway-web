import { styled } from "@mui/material";
import Typography from "@/components/Typography";

export const Highlight = styled(Typography)(({ theme }) => ({
    "> em": {
        "background-color": theme.palette.yellowCustom.main,
        "font-style": "normal",
    },
}));

export const ResultTitle = styled("div")(() => ({
    display: "flex",
    justifyContent: "space-between",
}));
