import { styled } from "@mui/material";
import Typography from "@/components/Typography";

export const ResultRow = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    "&:first-of-type": {
        marginTop: theme.spacing(2),
    },
}));

export const ResultRowCategory = styled(Typography)(({ theme }) => ({
    flexBasis: "20%",
    fontWeight: 500,
    marginRight: theme.spacing(2),
}));

export const ResultButtonWrap = styled("div")(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
}));

export const ResultTitle = styled("div")(() => ({
    display: "flex",
    justifyContent: "space-between",
}));
